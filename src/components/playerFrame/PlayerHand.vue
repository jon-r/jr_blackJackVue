<script setup lang="ts">
import { Position } from "../../types/animations.ts";
import { Player } from "../../types/players.ts";
import PlayerCards from "./PlayerCards.vue";

type PlayerHandProps = {
  isCurrentTurn: boolean;
  player: Player;
  framePos: Position;
};

const props = defineProps<PlayerHandProps>();
</script>

<template>
  <div class="player-hand frame flex-auto flex flex-column">
    <PlayerCards
      v-for="(hand, idx) in player.hands"
      :key="idx"
      :frame-pos="props.framePos"
      :hand="hand"
      :is-active="idx === player.activeHandId"
    />

    <div class="round-alert alert-text" v-if="player.outcome">
      {{ player.outcome }}
    </div>
  </div>
</template>
