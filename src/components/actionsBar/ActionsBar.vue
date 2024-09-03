<script setup lang="ts">
import { computed } from "vue";

import { GameStages } from "../../constants/gamePlay.ts";
import { useCoreStore } from "../../stores/coreStore.ts";
import { usePlayersStore } from "../../stores/playersStore.ts";
import BettingActions from "./BettingActions.vue";
import EndGameActions from "./EndGameActions.vue";
import GamePlayActions from "./GamePlayActions.vue";

const playersStore = usePlayersStore();
const coreStore = useCoreStore();

const tipsMessage = computed(() => {
  switch (coreStore.activeStage) {
    case GameStages.PlaceBets: {
      const money = playersStore.currentPlayer?.money;
      return `Current money: £${money}. Min Bet: £${coreStore.config.minBet}.`;
    }
    case GameStages.EndRound:
      return "Round Over. Keep on playing?";
    default:
      return "";
  }
});
</script>

<template>
  <section class="ctrl-bar flex">
    <template v-if="playersStore.currentPlayer">
      <div class="player-info frame text-right flex-auto">
        <h2>{{ playersStore.currentPlayer.name }}</h2>
        <p>{{ tipsMessage }}</p>
      </div>

      <BettingActions
        v-if="coreStore.activeStage === GameStages.PlaceBets"
        :player="playersStore.currentPlayer"
      />

      <GamePlayActions
        v-else-if="coreStore.activeStage === GameStages.PlayerActions"
        :player="playersStore.currentPlayer"
      />

      <EndGameActions
        v-else-if="coreStore.activeStage === GameStages.EndRound"
      />
    </template>
  </section>
</template>
