import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { DEFAULT_PLAYER } from "../constants/player.ts";
import { Player } from "../types/players.ts";
import { useCoreStore } from "./coreStore.ts";

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
  const dealer: Player = {
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
  const gamePlayStore = useCoreStore();

  const players = ref(defaultState.players);

  const dealer = computed(
    () => players.value.find((player) => player.isDealer) as Player,
  );

  const activePlayersCount = computed(
    () =>
      players.value.filter(
        (player) => player.money > gamePlayStore.config.minBet,
      ).length - 1,
  );

  const currentPlayer = computed(() =>
    players.value.find(
      (player) => player.index === gamePlayStore.activePlayerId,
    ),
  );
  // const currentPlayerHand = computed(
  //   () => currentPlayer.value?.hands[currentPlayer.value.activeHandId],
  // );

  function updateCurrentPlayer(update: Partial<Player>) {
    const updatedPlayers = [...players.value];
    const updatedPlayerIndex = updatedPlayers.findIndex(
      (player) => player.index === gamePlayStore.activePlayerId,
    );

    if (updatedPlayerIndex === -1) {
      return;
    }

    const updatedPlayer = updatedPlayers.at(updatedPlayerIndex)!;

    updatedPlayers[updatedPlayerIndex] = {
      ...updatedPlayer,
      ...update,
    };

    players.value = updatedPlayers;
  }

  function setPlayerNextHand(activeHandId: number) {
    if (
      currentPlayer.value &&
      activeHandId >= currentPlayer.value.hands.length
    ) {
      return gamePlayStore.nextPlayer();
    }

    updateCurrentPlayer({ activeHandId });
  }

  return {
    players,
    dealer,
    currentPlayer,
    activePlayersCount,
    // currentPlayerHand,

    setPlayerNextHand,
  };
});
