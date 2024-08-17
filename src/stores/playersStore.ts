import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { DEFAULT_PLAYER } from "../constants/player.ts";
import { Dealer, Player } from "../types/players.ts";
import { useGamePlayStore } from "./gamePlayStore.ts";

export type PlayersState = {
  players: Player[];
};

const defaultNames = ["Aaron", "Beth", "Chris", "Denise", "Ethan"];
function createDefaultState(): PlayersState {
  // todo maybe can move default pLayer here?
  const players: Player[] = defaultNames.map((name, index) => ({
    ...DEFAULT_PLAYER,
    index,
    name,
  }));
  const dealer: Dealer = {
    ...DEFAULT_PLAYER,
    name: "Dealer",
    index: 5,
    isDealer: true,
  };
  players.push(dealer);

  return { players };
}

export const usePlayersStore = defineStore("players", () => {
  const defaultState = createDefaultState();
  const gamePlayStore = useGamePlayStore();

  const players = ref(defaultState.players);

  const dealer = computed(
    () => players.value.find((player) => player.isDealer) as Dealer,
  );

  const currentPlayer = computed(() =>
    players.value.find(
      (player) => player.index === gamePlayStore.activePlayerId,
    ),
  );
  const activePlayersCount = computed(
    () =>
      players.value.filter(
        (player) => player.money > gamePlayStore.config.minBet,
      ).length - 1,
  );

  return { players, dealer, currentPlayer, activePlayersCount };
});
