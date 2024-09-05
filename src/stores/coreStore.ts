import { defineStore } from "pinia";
import { ref } from "vue";

import { GameStages } from "~/constants/gamePlay.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { DEFAULT_SETTINGS, MAX_MESSAGES } from "~/constants/settings.ts";
import { GameConfig } from "~/types/config.ts";

export const useCoreStore = defineStore("core", () => {
  const config = ref<GameConfig>(DEFAULT_SETTINGS);
  const activeStage = ref(GameStages.Init);
  const activePlayerId = ref(-1);
  const notifications = ref<string[]>([]);
  const isOptionsModalOpen = ref(activeStage.value === GameStages.Init);

  function toggleOptionsModal(isOpen: boolean) {
    isOptionsModalOpen.value = isOpen;
  }

  // todo send more messages
  function sendMessage(newMessage: string) {
    notifications.value.unshift(newMessage);
    notifications.value = notifications.value.slice(MAX_MESSAGES);
  }

  function setConfig(newConfig: GameConfig) {
    config.value = newConfig;
  }

  function jumpToStage(stage: GameStages) {
    jumpToPlayer(DEALER_ID);
    activeStage.value = stage;
  }

  function jumpToPlayer(playerId: number) {
    activePlayerId.value = playerId;
  }

  function newRound() {
    jumpToStage(GameStages.PlaceBets);
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
    activeStage,
    activePlayerId,
    notifications,
    isOptionsModalOpen,

    toggleOptionsModal,
    setConfig,
    sendMessage,
    newRound,
    nextStage,
    jumpToStage,
    jumpToPlayer,
  };
});
