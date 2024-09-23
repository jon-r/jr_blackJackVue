<script setup lang="ts">
import { onMounted, watch } from "vue";

import BlackjackTable from "~/components/BlackjackTable.vue";
import SvgStatic from "~/components/SvgStatic.vue";
import ActionsBar from "~/components/actionsBar/ActionsBar.vue";
import OptionsModal from "~/components/options/OptionsModal.vue";
import { GameStages } from "~/constants/gamePlay.ts";
import { DEFAULT_PLAYER_NAMES } from "~/constants/player.ts";
import { DEFAULT_DECK_COUNT, DEFAULT_MIN_BET } from "~/constants/settings.ts";
import { createPlayer } from "~/helpers/players.ts";
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

onMounted(() => {
  const isDemoMode = window.location.search.includes("demo=true");

  if (isDemoMode) {
    const defaultPlayers = DEFAULT_PLAYER_NAMES.map((name, i) =>
      createPlayer({ name }, i),
    );

    const demoConfig = {
      minBet: DEFAULT_MIN_BET,
      deckCount: DEFAULT_DECK_COUNT,
      playerCount: defaultPlayers.length,
      isDemo: true,
    };

    gameActions.startGame(defaultPlayers, demoConfig);
  }
});
</script>

<template>
  <main class="app-container" :class="coreStore.isDarkMode ? 'dark' : 'light'">
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

  border: solid 1px var(--md-sys-color-surface-dim);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
}
</style>
