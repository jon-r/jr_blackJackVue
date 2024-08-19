import { defineStore } from "pinia";

import { GameConfig } from "../types/config.ts";
import { PlayerInputStub } from "../types/players.ts";
import { useCoreStore } from "./coreStore.ts";
import { useDeckStore } from "./deckStore.ts";
import { usePlayersStore } from "./playersStore.ts";

export const useGamePlayStore = defineStore("gamePlay", () => {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();

  function newGame(players: PlayerInputStub[], config: GameConfig) {
    coreStore.setConfig(config);
    playersStore.resetPlayers(players);
    deckStore.rebuildDeck(config.deckCount);

    coreStore.startRound();
  }

  return { newGame };
});
