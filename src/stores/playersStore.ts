import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { DEALER, DEFAULT_PLAYER } from "../constants/player.ts";
import { wait } from "../helpers/time.ts";
import { Player, PlayerInputStub } from "../types/players.ts";
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

  const coreStore = useCoreStore();

  const players = ref(defaultState.players);

  const dealer = computed(
    () => players.value.find((player) => player.isDealer) as Player,
  );

  const activePlayersCount = computed(
    () =>
      players.value.filter((player) => player.money > coreStore.config.minBet)
        .length - 1,
  );

  const currentPlayer = computed(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

  function resetPlayers(stubs: PlayerInputStub[]) {
    const newPlayers: Player[] = stubs.map(({ name }, index) => ({
      ...DEFAULT_PLAYER,
      name,
      index,
    }));
    newPlayers.push({ ...DEALER, index: newPlayers.length });

    players.value = newPlayers;
  }

  async function dealCard() {
    const targetPlayer = players.value[coreStore.activePlayerId];

    if (!targetPlayer) {
      return;
    }

    console.log(`deal to ${targetPlayer.name}`);
    await wait(300);
  }

  return {
    players,
    dealer,
    currentPlayer,
    activePlayersCount,

    resetPlayers,
    dealCard,
  };
});
