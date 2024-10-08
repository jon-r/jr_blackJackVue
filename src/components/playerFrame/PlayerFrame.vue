<script setup lang="ts">
import { computed } from "vue";

import { isNotDealer } from "~/helpers/players.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import type { Player } from "~/types/players.ts";

import CurrentBet from "./CurrentBet.vue";
import PlayerHand from "./PlayerHand.vue";
import PlayerLabel from "./PlayerLabel.vue";

type PlayerFrameProps = {
  player: Player;
};

const props = defineProps<PlayerFrameProps>();
const coreStore = useCoreStore();

const notDealer = computed(() => isNotDealer(props.player));

const isPlayerTurn = computed(() => {
  return coreStore.activePlayerId === props.player.index;
});
</script>

<template>
  <section class="player-frame" :class="'player-frame--' + props.player.index">
    <PlayerHand
      v-for="(hand, idx) in player.hands"
      :key="idx"
      :hand="hand"
      :is-active="idx === player.activeHandId"
    />

    <strong v-if="player.outcome" class="player-frame__alert">
      {{ player.outcome }}
    </strong>

    <CurrentBet
      v-if="notDealer"
      :bet="props.player.openBet"
      :outcome="props.player.outcome"
    />

    <PlayerLabel
      v-if="notDealer"
      :is-focused="isPlayerTurn"
      :player="props.player"
    />
  </section>
</template>
<style>
.player-frame {
  position: absolute;
  top: 0;
  left: 0;
  height: 196px;
  width: 216px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  &--1 {
    transform: translate(6px, 190px);
  }
  &--2 {
    transform: translate(140px, 380px);
  }
  &--3 {
    transform: translate(404px, 420px);
  }
  &--4 {
    transform: translate(652px, 380px);
  }
  &--5 {
    transform: translate(802px, 190px);
  }

  /* dealer */
  &--0 {
    transform: translate(404px, 20px);
  }

  &__alert {
    position: absolute;
    inset: 3rem 0;

    text-align: center;
    font-size: var(--font-size-heading-small);
    text-shadow: 0 0 10px var(--md-sys-color-shadow);
    color: var(--md-sys-color-secondary-fixed);
  }
}
</style>
