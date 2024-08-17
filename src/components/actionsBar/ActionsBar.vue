<script setup lang="ts">
import { computed, watch } from "vue";

import { GameStages } from "../../constants/gamePlay.ts";
import { useAppStore } from "../../store/store.ts";
import { Player } from "../../types/players.ts";
import BettingActions from "./BettingActions.vue";
import EndGameActions from "./EndGameActions.vue";
import GamePlayActions from "./GamePlayActions.vue";
import {GamePlayState, useGamePlayStore} from "../../stores/gamePlayStore.ts";
import {storeToRefs} from "pinia";

type ActionsBarProps = {
  player?: Player;
};

const {dispatch} = useAppStore();
const gamePlayStore = useGamePlayStore()
const {config, activeStage}: GamePlayState = storeToRefs(gamePlayStore)
const props = defineProps<ActionsBarProps>();

const tipsMessage = computed(() => {
  const money = props.player?.money;

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

// todo can move to store
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
    <template v-if="player">
      <div class="player-info frame text-right flex-auto">
        <h2>{{ player.name }}</h2>
        <p>{{ tipsMessage }}</p>
      </div>

      <BettingActions
        v-if="activeStage === GameStages.PlaceBets"
        :player="player"
      />

      <GamePlayActions
        v-else-if="activeStage === GameStages.PlayerActions"
        :player="player"
      />

      <EndGameActions
        v-else-if="activeStage === GameStages.EndRound"
      />
    </template>
  </section>
</template>
