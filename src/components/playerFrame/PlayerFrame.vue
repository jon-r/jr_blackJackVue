<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { isNotDealer } from "~/helpers/players.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { Position } from "~/types/animations.ts";
import { Player } from "~/types/players.ts";

import CurrentBet from "./CurrentBet.vue";
import PlayerHand from "./PlayerHand.vue";
import PlayerLabel from "./PlayerLabel.vue";

type PlayerFrameProps = {
  player: Player;
};

const props = defineProps<PlayerFrameProps>();
const coreStore = useCoreStore();

// const playerClass = `player-${props.player.index}`;
// const oldMoney = ref(0);
// const diffFloat = ref(true);
const framePos = ref<Position>({ x: 0, y: 0 });

const frameParent = ref<HTMLElement>();

onMounted(() => {
  const { offsetLeft, offsetTop } = frameParent.value;
  framePos.value = {
    x: offsetLeft,
    y: offsetTop,
  };
});

// const diffClass = computed(() => {
//   // todo sideffect bad
//   triggerTextAnim();
//   return moneyDiff.value > 0 ? "good-text" : "error-text";
// });

const notDealer = computed(() => isNotDealer(props.player));

// const moneyDiff = computed(() => {
//   const out = props.player.money - oldMoney.value;
//   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
//   oldMoney.value = props.player.money;
//   return out;
// });

const isPlayerTurn = computed(() => {
  return coreStore.activePlayerId === props.player.index;
});

// function triggerTextAnim() {
//   diffFloat.value = false;
//   nextTick(() => {
//     diffFloat.value = true;
//   });
// }
</script>

<template>
  <section
    class="player-frame"
    :class="['player-frame--' + props.player.index]"
    ref="frameParent"
  >
    <PlayerHand
      v-if="props.player.inGame"
      :player="props.player"
      :frame-pos="framePos"
      :is-current-turn="isPlayerTurn"
    />

    <CurrentBet
      v-if="notDealer"
      :bet="props.player.openBet"
      :frame-pos="framePos"
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
  border: solid 1px red;
  position: absolute;
  top: 0;
  left: 0;
  height: 196px;
  width: 196px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* flex end may not be needed? */

  &--1 {
    transform: translate(26px, 190px);
  }
  &--2 {
    transform: translate(160px, 380px);
  }
  &--3 {
    transform: translate(424px, 420px);
  }
  &--4 {
    transform: translate(672px, 380px);
  }
  &--5 {
    transform: translate(822px, 190px);
  }

  /* dealer */
  &--0 {
    transform: translate(424px, 20px);
  }
}
</style>
