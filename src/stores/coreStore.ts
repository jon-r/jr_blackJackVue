import { defineStore } from "pinia";
import { ref } from "vue";

import { GameStages } from "../constants/gamePlay.ts";
import { GameConfig } from "../types/config.ts";

const MAX_MESSAGES = 5;

export const useCoreStore = defineStore("core", () => {
  const config = ref<GameConfig>({
    minBet: 100,
    autoTime: 500,
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

  function restartGame() {
    // todo need more here?
    jumpToStage(GameStages.Init);
  }

  function jumpToStage(stage: GameStages) {
    // todo skip player if they cant play
    activePlayerId.value = 0;
    activeStage.value = stage;
  }

  function jumpToPlayer(playerId: number) {
    activePlayerId.value = playerId;
  }

  function newRound() {
    gameRound.value += 1;
    jumpToStage(GameStages.PlaceBets);
  }

  function nextPlayer() {
    // todo skip player if they cant play
    if (activePlayerId.value === config.value.playerCount) {
      nextStage();
    } else {
      jumpToPlayer(activePlayerId.value + 1);
    }
  }

  function nextStage() {
    if (activeStage.value === GameStages.EndRound) {
      newRound();
    } else {
      jumpToStage(activeStage.value + 1);
    }
  }

  return {
    config,
    setConfig,
    gameRound,
    activeStage,
    activePlayerId,
    notifications,

    sendMessage,
    newRound,
    nextPlayer,
    jumpToStage,
    jumpToPlayer,
    // nextStage,
    restartGame,
    // endAllPlayerTurns,
  };
});
