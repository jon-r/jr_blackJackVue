<script setup lang="ts">
import { computed } from "vue";

import { setPos } from "~/animationTools.ts";
import { CHIP_VALUES } from "~/constants/gamePlay.ts";
import { Position } from "~/types/animations.ts";

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
  <div class="current-bet">
    <!--    <TransitionGroup
      class="chip-stack flex show"
      name="bets"
      tag="ul"
      @after-enter="enterTo"
      @enter="enter"
      @leave="leave"
    >-->
    <ul class="current-bet__chips">
      <li
        v-for="(chip, idx) in betAsChips"
        :key="idx"
        class="current-bet__chip-stacked"
      >
        <BettingChip :value="chip" is-stacked />
      </li>
    </ul>
    <!--    </TransitionGroup>-->

    <span class="current-bet__value" v-show="bet > 0">
      Placed Bet: £{{ bet }}
    </span>
  </div>
</template>

<style>
.current-bet {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 0.5rem;

  &__chips {
    display: flex;
    flex-direction: column-reverse;
    list-style: none;
    width: 2.5rem;
    padding: 0;
    margin: 0;
    position: relative;
  }

  /* todo handle z-index somehow. maybe js easiest */
  &__chip-stacked {
    margin-top: -1.7rem;

    &:first-child::before {
      content: "";
      display: block;
      height: 1.25rem;
      width: 2.5rem;
      border-radius: 50%;
      background-color: var(--md-sys-color-scrim);
      box-shadow: var(--shadow-level2);
      position: absolute;
      bottom: 10px;
      left: 0;
    }
  }

  &__value {
    font-size: 11px;
  }
}
</style>
