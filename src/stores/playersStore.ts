import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  BLACKJACK_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "../constants/cards.ts";
import { DEALER_ID, DEALER_STUB } from "../constants/player.ts";
import { getCardScore, isBlankCard } from "../helpers/cards.ts";
import { getHandScore, updateHand } from "../helpers/gamePlay.ts";
import {
  createEmptyHand,
  createPlayer,
  isActivePlayer,
} from "../helpers/players.ts";
import { wait } from "../helpers/time.ts";
import { PlayingCard } from "../types/card.ts";
import { GameHand, Player, PlayerInputStub } from "../types/players.ts";
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

  // todo maybe 'activePlayers' worth adding, its used in a few places
  // also make readonlys / setter+getters

  const activePlayersCount = computed(
    () => players.value.filter(isActivePlayer).length,
  );

  const currentPlayer = computed<Player | undefined>(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  function resetPlayers(stubs: PlayerInputStub[]) {
    players.value = [DEALER_STUB, ...stubs].map(createPlayer);
  }

  function addHand() {
    players.value[coreStore.activePlayerId]?.hands.push(createEmptyHand());
  }

  function nextHand(playerId = coreStore.activePlayerId) {
    const targetPlayer = players.value[playerId];

    if (!targetPlayer) return;

    const nextHand = targetPlayer.activeHandId + 1;

    if (nextHand === targetPlayer.hands.length) {
      return coreStore.nextPlayer();
    }

    targetPlayer.activeHandId = nextHand;
  }

  function getPlayerHand(
    playerId = coreStore.activePlayerId,
    handId?: number,
  ): GameHand | undefined {
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

    deckStore.returnCard(newCard);
  }

  function checkPlayerScore(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return;

    const playerMustStand = !targetHand || targetHand.score >= BLACKJACK_SCORE;

    // todo handle instant loss here? may need to move this function to playerActions

    if (playerMustStand) {
      coreStore.nextPlayer();
    }
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
    for (let i = 0; i < players.value.length; i++) {
      if (isActivePlayer(players.value[i])) {
        await dealCard(i);
      }
    }
  }

  async function revealCard(
    playerId?: number,
    handId?: number,
  ): Promise<PlayingCard | undefined> {
    await wait(coreStore.config.autoTime);

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
    for (let i = 0; i < players.value.length; i++) {
      if (isActivePlayer(players.value[i])) {
        await revealBlanks(i);
      }
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
    dealer,
    currentPlayer,
    activePlayersCount,

    resetPlayers,
    dealBlank,
    checkPlayerScore,
    dealCard,
    revealCard,
    dealAllPlayersCards,
    revealAllBlankCards,
    dealOrPeekDealer,
    addHand,
    nextHand,
  };
});
