import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  ACE_SCORE,
  BLACKJACK_SCORE,
  DEALER_STAND_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "../constants/cards.ts";
import { DEALER_NAME } from "../constants/player.ts";
import { getCardScore, getHandScore } from "../helpers/cards.ts";
// import { EMPTY_HAND, UNKNOWN_CARD } from "../constants/cards.ts";
// import { GameStages } from "../constants/gamePlay.ts";
// import { DEALER, DEFAULT_PLAYER } from "../constants/player.ts";
// import { wait } from "../helpers/time.ts";
import { Hand, RawCard } from "../types/card.ts";
import { Player, PlayerInputStub } from "../types/players.ts";
import { useCoreStore } from "./coreStore.ts";
import { useDeckStore } from "./deckStore.ts";

export function createEmptyHand(): Hand {
  return { cards: [], revealed: 0 };
}
export function createPlayer(name: string, index: number) {
  return {
    index,
    name,
    money: 1000,
    firstBet: 0,
    isDealer: false,
    score: 0,
    inGame: true,
    peeked: null,
    hands: [createEmptyHand()],
    activeHandId: 0,
  };
}

// const defaultNames = ["Aaron", "Beth", "Chris", "Denise", "Ethan"];
// function createDefaultPlayers(): Player[] {
//   const players: Player[] = defaultNames.map(createPlayer);
//   const dealer: Player = {
//     ...createPlayer("Dealer", players.length),
//     isDealer: true,
//   };
//   players.push(dealer);
//
//   return players;
// }

export const usePlayersStore = defineStore("players", () => {
  const coreStore = useCoreStore();
  const deckStore = useDeckStore();

  const players = ref<Player[]>([]);

  const dealer = computed(
    () => players.value.find((player) => player.isDealer) as Player,
  );
  // const realPlayers = computed(() => players.value.filter((player) => !player.isDealer));

  const activePlayersCount = computed(
    () =>
      players.value.filter((player) => !player.isDealer && player.inGame)
        .length,
  );

  const currentPlayer = computed(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  function resetPlayers(stubs: PlayerInputStub[]) {
    const newPlayers: Player[] = stubs.map(({ name }, index) =>
      createPlayer(name, index),
    );
    newPlayers.push({
      ...createPlayer(DEALER_NAME, newPlayers.length),
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

  function getPlayerWithHand(
    playerId = coreStore.activePlayerId,
    handId?: number,
  ): [Player?, Hand?] {
    const targetPlayer = players.value[playerId];
    if (!targetPlayer?.inGame) {
      return [undefined, undefined];
    }

    return [
      targetPlayer,
      targetPlayer.hands[handId ?? targetPlayer.activeHandId],
    ];
  }

  // function takeCard(playerId?: number, handId?: number) {
  //   const [, targetHand] = getPlayerWithHand(playerId, handId);
  //
  //   if (!targetHand) {
  //     return;
  //   }
  //
  //   if (targetHand.cards.length > targetHand.revealed) {
  //     // already have a blank card
  //     return;
  //   }
  //
  //   targetHand.cards.push(UNKNOWN_CARD);
  // }

  // async function revealCard(playerId?: number, handId?: number) {
  //   const [, targetHand] = getPlayerWithHand(playerId, handId);
  //
  //   if (!targetHand) {
  //     return;
  //   }
  //
  //   await wait(coreStore.config.autoTime);
  //
  //   const newCard = deckStore.drawCard();
  //   targetHand.cards[targetHand.revealed] = newCard;
  //   targetHand.revealed += 1;
  //
  //   return newCard;
  // }

  function dealerPeekCard(dealerHand: Hand): RawCard {
    const currentHandValue = getHandScore(dealerHand);

    if (ACE_SCORE !== currentHandValue && FACE_SCORE !== currentHandValue) {
      return UNKNOWN_CARD;
    }

    const newCard = deckStore.drawCard();
    if (getCardScore(newCard) + currentHandValue !== BLACKJACK_SCORE) {
      deckStore.returnCard(newCard);

      return UNKNOWN_CARD;
    }

    return newCard;
  }

  // async function revealOrPeek(playerId?: number, handId?: number) {
  //   const [player, targetHand] = getPlayerWithHand(playerId, handId);
  //
  //   if (!player || !targetHand) {
  //     return UNKNOWN_CARD; // shouldnt happen, maybe throw error?
  //   }
  //
  //   if (player.isDealer) {
  //     return dealerPeekCard(targetHand);
  //   } else {
  //     return revealCard(playerId);
  //   }
  // }

  // todo have this return the card (for use in messages/checks)
  // async function dealThenReveal(playerId?: number, handId?: number) {
  //   takeCard(playerId, handId);
  //   revealCard(playerId, handId);
  // }

  function checkCanContinue(playerId?: number, handId?: number) {
    const [player, targetHand] = getPlayerWithHand(playerId, handId);

    const playerMustStand = player?.isDealer
      ? DEALER_STAND_SCORE
      : BLACKJACK_SCORE;
    if (!targetHand || getHandScore(targetHand) >= playerMustStand) {
      coreStore.nextPlayer();
    }
  }

  function dealCard(playerId?: number, handId?: number) {
    const [, targetHand] = getPlayerWithHand(playerId, handId);

    if (!targetHand) {
      return; // shouldnt happen, maybe throw error?
    }

    const newCard = deckStore.drawCard();
    targetHand.cards[targetHand.revealed] = newCard;
    targetHand.revealed += 1;

    return newCard;
  }

  function dealBlank(playerId?: number, handId?: number) {
    const [, targetHand] = getPlayerWithHand(playerId, handId);

    if (!targetHand) {
      return; // shouldnt happen, maybe throw error?
    }

    const newCard = UNKNOWN_CARD;
    targetHand.cards[targetHand.revealed] = newCard;

    return newCard;
  }

  function dealOrPeek(playerId?: number) {
    const [player, targetHand] = getPlayerWithHand(playerId);

    if (!targetHand || !player) {
      return; // shouldnt happen, maybe throw error?
    }

    const newCard = player.isDealer
      ? dealerPeekCard(targetHand)
      : deckStore.drawCard();
    targetHand.cards[targetHand.revealed] = newCard;
    targetHand.revealed += 1;

    return newCard;
  }

  return {
    players,
    dealer,
    currentPlayer,
    activePlayersCount,

    resetPlayers,
    // addPlayerHand,
    // takeCard,
    // revealCard,
    // revealOrPeek,
    // dealThenReveal,
    dealBlank,
    checkCanContinue,
    dealCard,
    dealOrPeek,
    addHand,
    nextHand,
  };
});
