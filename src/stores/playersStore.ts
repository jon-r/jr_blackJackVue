import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { CardSuits } from "../constants/cards.ts";
// import { EMPTY_HAND, UNKNOWN_CARD } from "../constants/cards.ts";
// import { GameStages } from "../constants/gamePlay.ts";
// import { DEALER, DEFAULT_PLAYER } from "../constants/player.ts";
import { wait } from "../helpers/time.ts";
import { Hand } from "../types/card.ts";
import { Player, PlayerInputStub } from "../types/players.ts";
import { useCoreStore } from "./coreStore.ts";
import { useDeckStore } from "./deckStore.ts";

// export type PlayersState = {
//   players: Player[];
// };

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
      players.value.filter(
        (player) => !player.isDealer && player.money > coreStore.config.minBet,
      ).length,
  );

  const currentPlayer = computed(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  function resetPlayers(stubs: PlayerInputStub[]) {
    const newPlayers: Player[] = stubs.map(({ name }, index) =>
      createPlayer(name, index),
    );
    newPlayers.push({
      ...createPlayer("Dealer", newPlayers.length),
      isDealer: true,
    });

    players.value = newPlayers;
  }

  // function addPlayerHand() {
  //   players.value[coreStore.activePlayerId]?.hands.push(EMPTY_HAND);
  // }

  async function takeCard() {
    const targetPlayer = players.value[coreStore.activePlayerId];
    const targetHand = targetPlayer?.hands[targetPlayer.activeHandId];

    console.log({ targetPlayer, targetHand });

    if (!targetHand) {
      return;
    }
    //
    console.log(`deal to ${currentPlayer.value?.name}`);

    targetHand.cards.push([0, CardSuits.Blank]);
    // players.value[coreStore.activePlayerId]?.hands[targetHandId]?.cards.push(
    //   UNKNOWN_CARD,
    // );
    await wait(coreStore.config.autoTime);
  }

  function revealCard() {
    const targetPlayer = players.value[coreStore.activePlayerId];
    const targetHand = targetPlayer?.hands[targetPlayer.activeHandId];

    if (!targetHand) {
      return;
    }

    targetHand.cards[targetHand.revealed] = deckStore.drawCard();
    targetHand.revealed += 1;
  }

  return {
    players,
    dealer,
    currentPlayer,
    activePlayersCount,

    resetPlayers,
    // addPlayerHand,
    takeCard,
    revealCard,
  };
});
