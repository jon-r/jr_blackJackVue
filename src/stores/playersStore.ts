import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  BLACKJACK_SCORE,
  DEALER_STAND_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "~/constants/cards.ts";
import { DEALER_ID, DEALER_STUB } from "~/constants/player.ts";
import { AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import { getCardScore, isBlankCard } from "~/helpers/cards.ts";
import { getHandScore, updateHand } from "~/helpers/gamePlay.ts";
import {
  createEmptyHand,
  createPlayer,
  isActivePlayer,
} from "~/helpers/players.ts";
import { wait } from "~/helpers/time.ts";
import { PlayingCard } from "~/types/card.ts";
import { Player, PlayerHand, PlayerInputStub } from "~/types/players.ts";

import { useCoreStore } from "./coreStore.ts";
import { useDeckStore } from "./deckStore.ts";

// todo reorganise actions/functions in better folders (after style merge)
export const usePlayersStore = defineStore("players", () => {
  const coreStore = useCoreStore();
  const deckStore = useDeckStore();

  const players = ref<Player[]>([]);

  const dealer = computed(
    () => players.value.find((player) => player.index === DEALER_ID) as Player,
  );

  const activePlayers = computed(() => players.value.filter(isActivePlayer));

  const currentPlayer = computed<Player | undefined>(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  function resetPlayers(stubs: PlayerInputStub[]) {
    players.value = [DEALER_STUB, ...stubs].map(createPlayer);
  }

  function resetCards() {
    players.value.forEach((player) => {
      player.hands = [createEmptyHand()];
      player.outcome = null;
      player.activeHandId = 0;
      player.didPeek = null;
    });
  }

  function checkPlayersBalance() {
    players.value.forEach((player) => {
      if (player.money < coreStore.config.minBet) {
        player.inGame = false;
      }
    });
  }

  /*
  function addHand() {
    players.value[coreStore.activePlayerId]?.hands.push(createEmptyHand());
  }
*/

  function nextHand(playerId = coreStore.activePlayerId): boolean {
    const targetPlayer = players.value[playerId];

    if (!targetPlayer) return false;

    const nextHand = targetPlayer.activeHandId + 1;

    if (targetPlayer.hands[nextHand]) {
      targetPlayer.activeHandId = nextHand;
      return true;
    }

    return false;
  }

  function getPlayerHand(
    playerId = coreStore.activePlayerId,
    handId?: number,
  ): PlayerHand | undefined {
    const targetPlayer = players.value[playerId];
    if (!targetPlayer?.inGame) return;

    return targetPlayer.hands[handId ?? targetPlayer.activeHandId];
  }

  function dealerPeekCard(): PlayingCard | undefined {
    const currentCard = dealer.value.hands[0].cards[0];
    const cardScore = getCardScore(currentCard);

    if (cardScore < FACE_SCORE) return;

    const newCard = deckStore.drawCard();
    if (getHandScore([currentCard, newCard]).score === BLACKJACK_SCORE) {
      return newCard;
    }

    players.value[DEALER_ID].didPeek = newCard;
  }

  async function dealCard(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return;

    dealBlank(playerId, handId);

    return revealCard(playerId, handId);
  }

  async function dealOrPeekDealer() {
    dealBlank(DEALER_ID);

    const newCard = dealerPeekCard();
    if (newCard) {
      setCard(newCard, DEALER_ID);
    }

    return newCard;
  }

  async function dealAllPlayersCards() {
    for (let i = 0; i < activePlayers.value.length; i++) {
      await dealCard(activePlayers.value[i].index);
    }
  }

  async function revealCard(
    playerId?: number,
    handId?: number,
  ): Promise<PlayingCard | undefined> {
    await wait(AUTO_TIME_STANDARD);

    const newCard = deckStore.drawCard();

    setCard(newCard, playerId, handId);

    return newCard;
  }

  function setCard(
    card: PlayingCard,
    playerId = coreStore.activePlayerId,
    handId?: number,
  ) {
    const targetPlayer = players.value[playerId];
    const targetHand = getPlayerHand(playerId, handId);
    //
    if (!targetPlayer || !targetHand) return;

    targetPlayer.hands[handId ?? targetPlayer.activeHandId] = updateHand(
      targetHand,
      card,
    );
  }

  async function revealAllBlankCards() {
    if (dealer.value.didPeek) {
      setCard(dealer.value.didPeek, DEALER_ID);
    }
    let dealerMayContinue = dealer.value.hands[0].score < DEALER_STAND_SCORE;
    while (dealerMayContinue) {
      await revealCard(DEALER_ID);
      dealerMayContinue = dealer.value.hands[0].score < DEALER_STAND_SCORE;
    }

    for (let i = 0; i < activePlayers.value.length; i++) {
      await revealBlanks(activePlayers.value[i].index);
    }
  }

  async function revealBlanks(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    const cardsToReveal = targetHand.cards.filter(isBlankCard);

    for (let i = 0; i < cardsToReveal.length; i++) {
      await revealCard(playerId, handId);
    }
  }

  function dealBlank(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    targetHand.cards.push(UNKNOWN_CARD);
  }

  return {
    players,
    activePlayers,
    dealer,
    currentPlayer,

    resetPlayers,
    dealBlank,
    getPlayerHand,
    dealCard,
    dealAllPlayersCards,
    revealAllBlankCards,
    dealOrPeekDealer,
    nextHand,
    resetCards,
    checkPlayersBalance,
  };
});
