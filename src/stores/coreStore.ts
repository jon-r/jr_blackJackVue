import { defineStore } from "pinia";
import { ref } from "vue";

import { GameStages } from "../constants/gamePlay.ts";
import { GameConfig } from "../types/config.ts";

export type CoreState = {
  config: GameConfig;
  gameRound: number;
  activeStage: GameStages;
  activePlayerId: number;
  notifications: string[];
};

const MAX_MESSAGES = 5;

export const useCoreStore = defineStore("core", () => {
  const config = ref<GameConfig>({
    minBet: 100,
    autoTime: 250,
    deckCount: 6,
    playerCount: 5,
  });
  const gameRound = ref(-1);
  const activeStage = ref(GameStages.Init);
  const activePlayerId = ref(-1);
  const notifications = ref<string[]>([]);

  function sendMessage(newMessage: string) {
    notifications.value.unshift(newMessage);
    notifications.value.slice(MAX_MESSAGES);
  }

  function setConfig(newConfig: GameConfig) {
    config.value = newConfig;
  }

  function startRound() {
    gameRound.value += 1;
    activeStage.value = GameStages.PlaceBets;
    activePlayerId.value = 0;
  }

  function nextPlayer() {
    if (activePlayerId.value === config.value.playerCount) {
      nextStage();
      activePlayerId.value = 0;
    } else {
      activePlayerId.value += 1;
    }
  }
  function nextStage() {
    if (activeStage.value === GameStages.EndRound) {
      gameRound.value += 1;
      activeStage.value = GameStages.PlaceBets;
    } else {
      activeStage.value += 1;
    }
  }
  function endAllPlayerTurns() {
    activeStage.value = GameStages.DealerActions;
    nextPlayer();
  }

  return {
    config,
    setConfig,
    gameRound,
    activeStage,
    activePlayerId,
    notifications,

    sendMessage,
    startRound,
    nextPlayer,
    nextStage,
    endAllPlayerTurns,
  };
});
