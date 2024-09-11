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

watch(
  () => coreStore.activeStage,
  (stage: GameStages) => {
    switch (stage) {
      case GameStages.PlaceBets:
        gameActions.placeBets();
        break;
      case GameStages.DealCards:
        void gameActions.dealInitialCards();
        break;
      case GameStages.PlayerActions:
        gameActions.goToNextPlayer();
        break;
      case GameStages.DealerActions:
        void gameActions.dealFinalCards();
        break;
      case GameStages.EndRound:
        void gameActions.finaliseRound();
        break;
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
