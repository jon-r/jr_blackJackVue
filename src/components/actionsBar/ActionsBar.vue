<script setup lang="ts">
import { computed } from "vue";

import { GameStages } from "~/constants/gamePlay.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";
import { Player } from "~/types/players.ts";

import BettingActions from "./BettingActions.vue";
import EndGameActions from "./EndGameActions.vue";
import GamePlayActions from "./GamePlayActions.vue";

const playersStore = usePlayersStore();
const coreStore = useCoreStore();

const currentPlayer = computed<Player | undefined>(() =>
  playersStore.players.find(
    (player) => player.index === coreStore.activePlayerId,
  ),
);

const tipsMessage = computed(() => {
  switch (coreStore.activeStage) {
    case GameStages.PlaceBets: {
      const money = currentPlayer.value?.money;
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
  <section class="actions-bar">
    <template v-if="currentPlayer">
      <aside class="actions-bar__player-info">
        <h2 class="actions-bar__player-name">
          {{ currentPlayer.name }}
        </h2>
        <p>{{ tipsMessage }}</p>
      </aside>
      <menu class="actions-bar__controls">
        <BettingActions
          v-if="coreStore.activeStage === GameStages.PlaceBets"
          :player="currentPlayer"
        />

        <GamePlayActions
          v-else-if="coreStore.activeStage === GameStages.PlayerActions"
          :player="currentPlayer"
        />

        <EndGameActions
          v-else-if="coreStore.activeStage === GameStages.EndRound"
        />
      </menu>
    </template>
  </section>
</template>

<style>
.actions-bar {
  background-color: var(--md-sys-color-surface);
  height: 128px;
  padding: var(--padding-md);
  gap: var(--padding-md);
  display: flex;
  align-items: stretch;

  color: var(--md-sys-color-on-surface);

  &__player-info {
    flex: 1;
    text-align: right;
  }

  &__player-name {
    color: var(--md-sys-color-on-surface-variant);
  }

  &__controls {
    flex: 2;
    margin: 0;
    padding: 0;
    gap: 2px;

    display: flex;
  }
}
</style>
