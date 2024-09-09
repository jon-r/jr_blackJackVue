import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  BLACKJACK_SCORE, // DEALER_STAND_SCORE,
  FACE_SCORE, // UNKNOWN_CARD,
} from "~/constants/cards.ts";
import { DEALER_ID, DEALER_STUB } from "~/constants/player.ts";
// import { AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import { getCardScore } from "~/helpers/cards.ts";
import { getHandScore, updateHand } from "~/helpers/gamePlay.ts";
import {
  createEmptyHand,
  createPlayer,
  isActivePlayer,
} from "~/helpers/players.ts";
// import { wait } from "~/helpers/time.ts";
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

  function getNextHand(playerId = coreStore.activePlayerId): boolean {
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

  // async function dealOrPeekDealerCard() {
  //   return dealCard(DEALER_ID, 0, true);
  // }
  //
  // async function dealAllPlayersCards(mayPeek = false) {
  //   for (let i = 0; i < activePlayers.value.length; i++) {
  //     await dealCard(activePlayers.value[i].index);
  //   }
  //
  //   await dealCard(DEALER_ID, 0, mayPeek);
  // }
  //
  // function dealBlank(playerId: number, handId?: number) {
  //   // const targetHand = getPlayerHand(playerId, handId);
  //   //
  //   // if (!targetHand) return; // shouldnt happen, maybe throw error?
  //   //
  //   // targetHand.cards.push(UNKNOWN_CARD);
  //   setCard(UNKNOWN_CARD, playerId, handId);
  // }
  //
  // async function dealCard(
  //   playerId: number,
  //   handId?: number,
  //   dealerMayPeek = false,
  // ): Promise<PlayingCard | undefined> {
  //   await wait(AUTO_TIME_STANDARD);
  //
  //   const newCard = dealerMayPeek ? dealerPeekCard() : deckStore.drawCard();
  //
  //   if (newCard) {
  //     setCard(newCard, playerId, handId);
  //   }
  //
  //   return newCard;
  // }

  function setCard(card: PlayingCard, playerId: number, handId?: number) {
    const targetPlayer = players.value[playerId];
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetPlayer || !targetHand) return;

    targetPlayer.hands[handId ?? targetPlayer.activeHandId] = updateHand(
      targetHand,
      card,
    );
  }

  // async function revealAllBlankCards() {
  //   await revealDealerBlanks();
  //
  //   for (let i = 0; i < activePlayers.value.length; i++) {
  //     await revealPlayerBlanks(activePlayers.value[i].index);
  //   }
  // }
  //
  // async function revealDealerBlanks() {
  //   if (dealer.value.didPeek) {
  //     setCard(dealer.value.didPeek, DEALER_ID);
  //   }
  //   let dealerMayContinue = true;
  //   while (dealerMayContinue) {
  //     dealerMayContinue = dealer.value.hands[0].score < DEALER_STAND_SCORE;
  //     if (dealerMayContinue) {
  //       await dealCard(DEALER_ID);
  //     }
  //   }
  // }
  //
  // async function revealPlayerBlanks(playerId: number, handId?: number) {
  //   const targetHand = getPlayerHand(playerId, handId);
  //
  //   if (!targetHand) return; // shouldnt happen, maybe throw error?
  //
  //   const cardsToReveal = targetHand.cards.filter(isBlankCard);
  //
  //   for (let i = 0; i < cardsToReveal.length; i++) {
  //     await dealCard(playerId, handId);
  //   }
  // }

  return {
    players,
    activePlayers,
    dealer,
    currentPlayer,

    resetPlayers,
    // dealBlank,
    getPlayerHand,
    // dealCard,
    // dealAllPlayersCards,
    // revealAllBlankCards,
    // dealOrPeekDealerCard,
    getNextHand,
    resetCards,
    checkPlayersBalance,

    setCard,
    dealerPeekCard,
  };
});
