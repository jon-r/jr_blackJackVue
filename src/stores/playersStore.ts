import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  BLACKJACK_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "../constants/cards.ts";
import { GameStages } from "../constants/gamePlay.ts";
import { DEALER_ID, DEALER_NAME } from "../constants/player.ts";
import { getCardScore, getHandOutcome, isBlankCard } from "../helpers/cards.ts";
import {
  createEmptyHand,
  createPlayer,
  isPlayerActive,
} from "../helpers/players.ts";
import { wait } from "../helpers/time.ts";
import { Hand, RawCard } from "../types/card.ts";
import { Player, PlayerInputStub } from "../types/players.ts";
import { useCoreStore } from "./coreStore.ts";
import { useDeckStore } from "./deckStore.ts";

// todo reorganise actions in better folders
export const usePlayersStore = defineStore("players", () => {
  const coreStore = useCoreStore();
  const deckStore = useDeckStore();

  const players = ref<Player[]>([]);

  const dealer = computed(
    () => players.value.find((player) => player.isDealer) as Player,
  );

  const activePlayersCount = computed(
    () =>
      players.value.filter((player) => !player.isDealer && player.inGame)
        .length,
  );

  const currentPlayer = computed<Player | undefined>(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  const dealerOutcome = computed(() => getHandOutcome(dealer.value.hands[0]));

  function resetPlayers(stubs: PlayerInputStub[]) {
    const newPlayers: Player[] = stubs.map(({ name }, index) =>
      createPlayer(name, index + 1),
    );
    newPlayers.unshift({
      ...createPlayer(DEALER_NAME, DEALER_ID),
      isDealer: true,
    });

    players.value = newPlayers;
  }

  function addHand() {
    players.value[coreStore.activePlayerId]?.hands.push(createEmptyHand());
  }

  function nextHand(playerId = coreStore.activePlayerId) {
    const targetPlayer = players.value[playerId];

    if (!targetPlayer) {
      return;
    }

    const nextHand = targetPlayer.activeHandId + 1;

    if (nextHand === targetPlayer.hands.length) {
      return coreStore.nextPlayer();
    }

    targetPlayer.activeHandId = nextHand;
  }

  function getPlayerHand(
    playerId = coreStore.activePlayerId,
    handId?: number,
  ): Hand | undefined {
    const targetPlayer = players.value[playerId];
    if (!targetPlayer?.inGame) {
      return;
    }

    return targetPlayer.hands[handId ?? targetPlayer.activeHandId];
  }

  function dealerPeekCard(): RawCard | undefined {
    const currentHandValue = dealerOutcome.value.score;

    if (currentHandValue < FACE_SCORE) {
      return;
    }

    const newCard = deckStore.drawCard();
    if (getCardScore(newCard) + currentHandValue !== BLACKJACK_SCORE) {
      deckStore.returnCard(newCard);

      return;
    } else {
      coreStore.jumpToStage(GameStages.EndRound);
    }

    return newCard;
  }

  function checkPlayerScore(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    const outcome = getHandOutcome(targetHand);

    const playerMustStand = outcome.score >= BLACKJACK_SCORE;

    // todo handle instant loss here? need to move this function to playerActions

    if (playerMustStand) {
      coreStore.nextPlayer();
    }
  }

  async function dealCard(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return;

    dealBlank(playerId, handId);

    await wait(coreStore.config.autoTime);

    const newCard = deckStore.drawCard();
    revealCard(newCard, playerId);

    return newCard;
  }

  async function dealAllPlayersCards() {
    for (let i = 0; i < players.value.length; i++) {
      if (isPlayerActive(players.value[i])) {
        await dealCard(i);
      }
    }
  }

  async function revealAllBlankCards() {
    for (let i = 0; i < players.value.length; i++) {
      if (isPlayerActive(players.value[i])) {
        await wait(coreStore.config.autoTime);
        revealBlanks(i);
      }
    }
  }

  function revealBlanks(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    const cardsToReveal = targetHand.cards.filter(isBlankCard);

    for (let i = 0; i < cardsToReveal.length; i++) {
      const newCard = deckStore.drawCard();
      revealCard(newCard, playerId);
    }
  }

  function revealCard(card: RawCard, playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return;

    targetHand.cards[targetHand.revealed] = card;
    targetHand.revealed += 1;
  }

  function dealBlank(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    targetHand.cards[targetHand.revealed] = UNKNOWN_CARD;
  }

  async function dealOrPeekDealer() {
    dealBlank(DEALER_ID);

    await wait(coreStore.config.autoTime);

    const newCard = dealerPeekCard();

    if (newCard) {
      revealCard(newCard, DEALER_ID);
    }

    return newCard;
  }

  function setFinalScores() {
    players.value.forEach((player) => {
      player.score = getHandOutcome(player.hands[0]);
      // todo handle split hands
    });
  }

  return {
    players,
    dealer,
    dealerOutcome,
    currentPlayer,
    activePlayersCount,

    resetPlayers,
    dealBlank,
    checkPlayerScore,
    dealCard,
    dealAllPlayersCards,
    revealAllBlankCards,
    dealOrPeekDealer,
    addHand,
    nextHand,
    setFinalScores,
  };
});
