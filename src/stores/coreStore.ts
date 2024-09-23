import { defineStore } from "pinia";
import { ref } from "vue";

import { GameStages } from "~/constants/gamePlay.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { DEFAULT_SETTINGS, MAX_MESSAGES } from "~/constants/settings.ts";
import { getIsDarkModePreferred } from "~/helpers/style.ts";
import type { Message } from "~/types/animations.ts";
import type { GameConfig } from "~/types/config.ts";

export const useCoreStore = defineStore("core", () => {
  const config = ref<GameConfig>(DEFAULT_SETTINGS);
  const activeStage = ref(GameStages.Init);
  const activePlayerId = ref(-1);

  const isDarkMode = ref(getIsDarkModePreferred().matches);
  const isDarkModeForced = ref(false);
  const isOptionsModalOpen = ref(activeStage.value === GameStages.Init);
  const messages = ref<Message[]>([]);

  function toggleDarkMode(isDark = !isDarkMode.value) {
    isDarkMode.value = isDark;
    isDarkModeForced.value = true;
  }

  getIsDarkModePreferred().addEventListener("change", ({ matches }) => {
    if (!isDarkModeForced.value) {
      isDarkMode.value = matches;
    }
  });

  function toggleOptionsModal(isOpen: boolean) {
    isOptionsModalOpen.value = isOpen;
  }

  function sendMessage(message: string) {
    const newMessage: Message = {
      id: Math.max(...messages.value.map((m) => m.id), -1) + 1,
      value: message,
    };

    messages.value = [newMessage, ...messages.value].slice(0, MAX_MESSAGES);
  }

  function setConfig(newConfig: GameConfig) {
    config.value = newConfig;
  }

  function jumpToStage(stage: GameStages) {
    jumpToPlayer(DEALER_ID.index);
    activeStage.value = stage;
  }

  function jumpToPlayer(playerId: number) {
    activePlayerId.value = playerId;
  }

  function nextStage() {
    if (activeStage.value === GameStages.EndRound) {
      jumpToStage(GameStages.PlaceBets);
    } else {
      jumpToStage(activeStage.value + 1);
    }
  }

  return {
    config,
    activeStage,
    activePlayerId,
    messages,
    isOptionsModalOpen,
    isDarkModeForced,
    isDarkMode,

    toggleOptionsModal,
    toggleDarkMode,
    setConfig,
    sendMessage,
    nextStage,
    jumpToStage,
    jumpToPlayer,
  };
});
