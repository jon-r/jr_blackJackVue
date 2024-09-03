<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";

import { isNotDealer } from "../../helpers/players.ts";
import { useCoreStore } from "../../stores/coreStore.ts";
import { Position } from "../../types/animations.ts";
import { Player } from "../../types/players.ts";
import ActiveBets from "./ActiveBets.vue";
import PlayerHand from "./PlayerHand.vue";

type PlayerFrameProps = {
  player: Player;
};

const props = defineProps<PlayerFrameProps>();
const coreStore = useCoreStore();

const playerClass = `player-${props.player.index}`;
const oldMoney = ref(0);
const diffFloat = ref(true);
const framePos = ref<Position>({ x: 0, y: 0 });

const frameParent = ref<HTMLElement>();

onMounted(() => {
  const { offsetLeft, offsetTop } = frameParent.value;
  framePos.value = {
    x: offsetLeft,
    y: offsetTop,
  };
});

const diffClass = computed(() => {
  // todo sideffect bad
  triggerTextAnim();
  return moneyDiff.value > 0 ? "good-text" : "error-text";
});

const notDealer = computed(() => isNotDealer(props.player));

const moneyDiff = computed(() => {
  const out = props.player.money - oldMoney.value;
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  oldMoney.value = props.player.money;
  return out;
});

const isPlayerTurn = computed(() => {
  return coreStore.activePlayerId === props.player.index;
});

function triggerTextAnim() {
  diffFloat.value = false;
  nextTick(() => {
    diffFloat.value = true;
  });
}
</script>

<template>
  <section
    class="player-frame flex flex-column"
    :class="playerClass"
    ref="frameParent"
  >
    <PlayerHand
      v-if="props.player.inGame"
      :player="props.player"
      :frame-pos="framePos"
      :is-current-turn="isPlayerTurn"
    />

    <ActiveBets
      v-if="notDealer"
      :bet="props.player.openBet"
      :frame-pos="framePos"
    />

    <header
      class="player-frame-title flex frame shadow-light"
      v-if="notDealer"
      :class="{ 'is-active': isPlayerTurn }"
    >
      <h4
        class="player-name"
        :class="{
          'alert-text': isPlayerTurn,
          'error-text': !props.player.inGame,
        }"
      >
        {{ props.player.name }}
      </h4>

      <h5 class="player-money">
        £{{ props.player.money }}
        <span :class="[diffClass, { 'diff-float': diffFloat }]">
          £{{ moneyDiff }}
        </span>
      </h5>
    </header>
  </section>
</template>
