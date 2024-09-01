import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  ACE_SCORE,
  BLACKJACK_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "../constants/cards.ts";
import { DEALER_ID, DEALER_NAME } from "../constants/player.ts";
import {
  getCardScore,
  isBlankCard,
  oldGetHandScore,
} from "../helpers/cards.ts";
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

// todo reorganise actions
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

  const currentPlayer = computed(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  const dealerScore = computed(() => oldGetHandScore(dealer.value.hands[0]));

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

  function dealerPeekCard(dealerHand: Hand): RawCard | undefined {
    const currentHandValue = oldGetHandScore(dealerHand);

    if (ACE_SCORE !== currentHandValue && FACE_SCORE !== currentHandValue) {
      return;
    }

    const newCard = deckStore.drawCard();
    if (getCardScore(newCard) + currentHandValue !== BLACKJACK_SCORE) {
      deckStore.returnCard(newCard);

      return;
    }

    return newCard;
  }

  function checkPlayerScore(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    const playerMustStand = oldGetHandScore(targetHand) >= BLACKJACK_SCORE;

    // todo handle instant wins/losses here? need to move this function to playerActions

    if (!targetHand || playerMustStand) {
      coreStore.nextPlayer();
    }
  }

  async function dealCard(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

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

  async function dealOrPeek(playerId?: number) {
    const targetHand = getPlayerHand(playerId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    dealBlank(playerId);

    await wait(coreStore.config.autoTime);

    const newCard = dealerPeekCard(targetHand);

    if (newCard) {
      revealCard(newCard, playerId);
    }

    return newCard;
  }

  return {
    players,
    dealer,
    dealerScore,
    currentPlayer,
    activePlayersCount,

    resetPlayers,
    dealBlank,
    checkPlayerScore,
    dealCard,
    dealAllPlayersCards,
    revealAllBlankCards,
    dealOrPeek,
    addHand,
    nextHand,
  };
});
