<script setup lang="ts">
import { watch } from "vue";

import BlackjackTable from "~/components/BlackjackTable.vue";
import SvgStatic from "~/components/SvgStatic.vue";
import ActionsBar from "~/components/actionsBar/ActionsBar.vue";
import OptionsModal from "~/components/options/OptionsModal.vue";
import { GameStages } from "~/constants/gamePlay.ts";
import { useGameActions } from "~/stores/actions/game.ts";
import { useCoreStore } from "~/stores/coreStore.ts";

const coreStore = useCoreStore();
const gameActions = useGameActions();

// todo maybe move the message to gameActions
watch(
  () => coreStore.activeStage,
  (stage: GameStages) => {
    switch (stage) {
      case GameStages.Init:
        return coreStore.toggleOptionsModal(true);
      case GameStages.PlaceBets:
        coreStore.sendMessage("Please place your bets.");
        return gameActions.goToNextPlayer();
      case GameStages.DealCards:
        coreStore.sendMessage("All bets are in, dealing out first cards.");
        return gameActions.dealInitialCards();
      case GameStages.PlayerActions:
        return gameActions.goToNextPlayer();
      case GameStages.DealerActions:
        return gameActions.dealFinalCards();
      case GameStages.EndRound:
        coreStore.sendMessage("Round over. Play again?");
        return gameActions.finaliseRound();
    }
  },
);
</script>

<template>
  <!-- todo light vs dark modes toggle -->
  <main class="app-container light">
    <BlackjackTable />
    <ActionsBar />
    <OptionsModal />
  </main>

  <SvgStatic v-once />
</template>
<style>
.app-container {
  height: 100vh;
  max-height: 768px;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  border: solid 1px var(--md-sys-color-outline-variant);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
}
</style>
