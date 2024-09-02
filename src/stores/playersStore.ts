import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  BLACKJACK_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "../constants/cards.ts";
import { GameStages } from "../constants/gamePlay.ts";
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

// todo reorganise actions in better folders
export const usePlayersStore = defineStore("players", () => {
  const coreStore = useCoreStore();
  const deckStore = useDeckStore();

  const players = ref<Player[]>([]);

  const dealer = computed(
    () => players.value.find((player) => player.index === DEALER_ID) as Player,
  );

  const activePlayersCount = computed(
    () => players.value.filter(isActivePlayer).length,
  );

  const currentPlayer = computed<Player | undefined>(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  function resetPlayers(stubs: PlayerInputStub[]) {
    players.value = [DEALER_STUB, ...stubs].map(({ name }, index) =>
      createPlayer(name, index + 1),
    );
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
      revealCard(newCard, DEALER_ID);
      coreStore.jumpToStage(GameStages.EndRound);
    } else {
      deckStore.returnCard(newCard);
    }

    return newCard;
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

    await wait(coreStore.config.autoTime);

    const newCard = deckStore.drawCard();
    revealCard(newCard, playerId);

    return newCard;
  }

  async function dealAllPlayersCards() {
    for (let i = 0; i < players.value.length; i++) {
      if (isActivePlayer(players.value[i])) {
        await dealCard(i);
      }
    }
  }

  async function revealAllBlankCards() {
    for (let i = 0; i < players.value.length; i++) {
      if (isActivePlayer(players.value[i])) {
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

  // todo update score/specials here
  function revealCard(
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

  function dealBlank(playerId?: number, handId?: number) {
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    targetHand.cards.push(UNKNOWN_CARD);

    // targetHand.cards[targetHand.revealed] = UNKNOWN_CARD;
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

  // function setFinalScores() {
  //   players.value.forEach((player) => {
  //     player.score = getHandOutcome(player.hands[0]);
  //     // todo handle split hands
  //   });
  // }

  return {
    players,
    dealer,
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
  };
});
