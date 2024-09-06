<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { setPos } from "~/animationTools.ts";
import { CHIP_VALUES } from "~/constants/gamePlay.ts";
import { sum } from "~/helpers/math.ts";
import { Position } from "~/types/animations.ts";

import BettingChip from "../common/BettingChip.vue";

type ActiveBetProps = {
  bet: number;
  framePos: Position;
};

const props = defineProps<ActiveBetProps>();
const betAsChips = ref([]);

// todo animate this with a watch function and stagger in tokens
// also potentially change direction of chips depending on win vs loss?
const betAsChipsOld = computed<number[]>(() => {
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

watch(
  () => props.bet,
  async function staggerChips() {
    let betDiff = props.bet - sum(betAsChips.value);
    const chips = betAsChips.value;
  },
);

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
    <ul class="list-base current-bet__chips">
      <li
        v-for="(chip, idx) in betAsChipsOld"
        :key="idx"
        class="current-bet__chip-stacked"
      >
        <BettingChip :value="chip" is-stacked />
      </li>
    </ul>
    <!--    </TransitionGroup>-->

    <small class="current-bet__value" v-show="bet > 0">
      Placed Bet: £{{ bet }}
    </small>
  </div>
</template>

<style>
.current-bet {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 var(--padding-sm);

  &__chips {
    display: flex;
    flex-direction: column-reverse;
    width: 40px;
    position: relative;
  }

  &__chip-stacked {
    margin-top: -28px;

    &:first-child::before {
      content: "";
      display: block;
      height: 20px;
      width: 40px;
      border-radius: 50%;
      background-color: var(--md-sys-color-scrim);
      box-shadow: var(--shadow-level-2);
      position: absolute;
      bottom: 10px;
      left: 0;
    }
  }
}
</style>
