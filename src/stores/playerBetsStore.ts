import { defineStore } from "pinia";

import { useCoreStore } from "./coreStore.ts";
import { usePlayersStore } from "./playersStore.ts";

export const usePlayerBetsStore = defineStore("playerBets", () => {
  const playersStore = usePlayersStore();
  const coreStore = useCoreStore();

  function placeBet(value: string) {
    const targetPlayer = playersStore.players[coreStore.activePlayerId];

    if (!targetPlayer) {
      return;
    }

    targetPlayer.money -= value;
    targetPlayer.firstBet += value;
    coreStore.sendMessage(`${targetPlayer.name} bets £${value}`);
    coreStore.nextPlayer();
  }

  return { placeBet };
});
