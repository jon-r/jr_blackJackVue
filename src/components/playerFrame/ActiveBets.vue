<script setup lang="ts">
import { computed } from "vue";

import { setPos } from "../../animationTools.ts";
import { CHIP_VALUES } from "../../constants/gamePlay.ts";
import { Position } from "../../types/animations.ts";
import BettingChip from "../common/BettingChip.vue";

type ActiveBetProps = {
  bet: number;
  framePos: Position;
};

const props = defineProps<ActiveBetProps>();

// todo animate this with a watch function and stagger in tokens
// also potentially change direction of chips depending on win vs loss?
const betAsChips = computed<number[]>(() => {
  let chipsValue = props.bet;
  const chips = [];
  while (chipsValue > 0) {
    const bestChip = CHIP_VALUES.find((value) => value <= chipsValue);

    if (!bestChip) break;

    chipsValue -= bestChip;
    chips.push(bestChip);
  }

  return chips;
});

function enter(el: HTMLElement) {
  setPos(el, { x: 0, y: -200 });
}

function enterTo(el: HTMLElement) {
  requestAnimationFrame(() => {
    setPos(el, { x: 0, y: 0 });
  });
}

function leave(el: HTMLElement, done: () => void) {
  const frame = props.framePos;
  setPos(el, { x: 0, y: -frame.y });
  el.addEventListener("transitionend", () => {
    done();
  });
}
</script>
<template>
  <div class="player-bet flex">
    <TransitionGroup
      class="chip-stack flex show"
      name="bets"
      tag="ul"
      @after-enter="enterTo"
      @enter="enter"
      @leave="leave"
    >
      <BettingChip
        v-for="(chip, idx) in betAsChips"
        :key="idx"
        :value="chip"
        is-stacked
      />
    </TransitionGroup>

    <span v-show="bet > 0">Bet: £{{ bet }}</span>
  </div>
</template>
