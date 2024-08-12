<script setup lang="ts">
import { computed, watch } from "vue";

import { GameStages } from "../../constants/gamePlay.ts";
import { useAppStore } from "../../store/store.ts";
import { Player } from "../../types/players.ts";
import BettingActions from "./BettingActions.vue";
import EndGameActions from "./EndGameActions.vue";
import GamePlayActions from "./GamePlayActions.vue";

type ActionsBarProps = {
  player?: Player;
};

const store = useAppStore();
const props = defineProps<ActionsBarProps>();

const tipsMessage = computed(() => {
  const money = props.player?.money;
  const { stage, config } = store.getters;
  const out = new Map([
    [0, `Current money: £${money}. Min Bet: £${config.minBet}.`],
    [5, "Round Over. Keep on playing?"],
    // todo bonus = more tips?
  ]);

  return out.has(stage) ? out.get(stage) : "";
});

watch(store.getters.gameStage, (stage: GameStages) => {
  const out = new Map([
    [GameStages.Init, "Please place Your bets"],
    [GameStages.DealOne, "All bets are in, dealing out the first cards."],
    [GameStages.EndRound, "Round Over"],
  ]);

  if (!out.has(stage)) return false;

  const msg = out.get(stage);

  return store.dispatch("setNewMessage", msg);
});
</script>

<template>
  <section class="ctrl-bar flex">
    <template v-if="player">
      <div class="player-info frame text-right flex-auto">
        <h2>{{ player.name }}</h2>
        <p>{{ tipsMessage }}</p>
      </div>

      <BettingActions
        v-if="store.getters.gameStage === GameStages.PlaceBets"
        :player="player"
      />

      <GamePlayActions
        v-else-if="store.getters.gameStage === GameStages.PlayerActions"
        :player="player"
      />

      <EndGameActions
        v-else-if="store.getters.gameStage === GameStages.EndRound"
      />
    </template>
  </section>
</template>
