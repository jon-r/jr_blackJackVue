<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";

import { GameStages } from "../../constants/gamePlay.ts";
import { useAppStore } from "../../store/store.ts";
import { CoreState, useCoreStore } from "../../stores/coreStore.ts";
import { usePlayersStore } from "../../stores/playersStore.ts";
// import { Player } from "../../types/players.ts";
import BettingActions from "./BettingActions.vue";
import EndGameActions from "./EndGameActions.vue";
import GamePlayActions from "./GamePlayActions.vue";

// type ActionsBarProps = {
//   player?: Player;
// };

const { dispatch } = useAppStore();
const playersStore = usePlayersStore();
const coreStore = useCoreStore();
const { config, activeStage }: CoreState = storeToRefs(coreStore);
// const props = defineProps<ActionsBarProps>();

const tipsMessage = computed(() => {
  const money = playersStore.currentPlayer?.money;

  // const { gameStage, config } = store.getters;
  const out = new Map<GameStages, string>([
    [
      GameStages.PlaceBets,
      `Current money: £${money}. Min Bet: £${config.minBet}.`,
    ],
    [GameStages.EndRound, "Round Over. Keep on playing?"],
    // todo bonus = more tips?
  ]);

  return out.get(activeStage) ?? "";
});

// todo can move to store (gameplay?)
watch(
  () => activeStage,
  function updateStageMessage(stage: GameStages) {
    const out = new Map<GameStages, string>([
      [GameStages.PlaceBets, "Please place Your bets"],
      [GameStages.DealOne, "All bets are in, dealing out the first cards."],
      [GameStages.EndRound, "Round Over"],
    ]);

    if (!out.has(stage)) return false;

    const msg = out.get(stage);

    return dispatch("setNewMessage", msg);
  },
);
</script>

<template>
  <section class="ctrl-bar flex">
    <template v-if="playersStore.currentPlayer">
      <div class="player-info frame text-right flex-auto">
        <h2>{{ playersStore.currentPlayer }}</h2>
        <p>{{ tipsMessage }}</p>
      </div>

      <BettingActions
        v-if="activeStage === GameStages.PlaceBets"
        :player="playersStore.currentPlayer"
      />

      <GamePlayActions
        v-else-if="activeStage === GameStages.PlayerActions"
        :player="playersStore.currentPlayer"
      />

      <EndGameActions v-else-if="activeStage === GameStages.EndRound" />
    </template>
  </section>
</template>
