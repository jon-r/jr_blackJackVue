import { defineStore, storeToRefs } from "pinia";

import { PlayersState, usePlayersStore } from "./playersStore.ts";

export const usePlayerCardsStore = defineStore("playerCards", () => {
  const playersStore = usePlayersStore();
  // const coreStore = useCoreStore();
  // const {currentPlayer, players}: ToRefs<PlayersState> = storeToRefs(playerStore)

  // function placeMainBet(value: number) {
  //   playersStore.updateCurrentPlayer({
  //     firstBet: value,
  //     money: -value,
  //   });
  // }

  return {};
});
