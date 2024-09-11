<script setup lang="ts">
import { ref, watch } from "vue";

import { GameOutcomes } from "~/constants/gamePlay.ts";
import { AUTO_TIME_SHORT } from "~/constants/settings.ts";
import { staggeredPush } from "~/helpers/animation.ts";
import {
  hasMoneyLost,
  hasMoneyReturned,
  moneyToChips,
} from "~/helpers/bets.ts";
import { sum } from "~/helpers/math.ts";

import BettingChip from "../common/BettingChip.vue";

type ActiveBetProps = {
  bet: number;
  outcome: GameOutcomes | null;
};

const props = defineProps<ActiveBetProps>();

const betAsChips = ref([]);

watch(
  () => props.bet,
  async function staggerChips() {
    if (props.bet === 0) {
      betAsChips.value = [];
      return;
    }

    let betDiff = props.bet - sum(betAsChips.value);

    if (betDiff > 0) {
      const newChips = moneyToChips(betDiff);

      await staggeredPush(betAsChips.value, newChips, AUTO_TIME_SHORT);
    }
    // else the full stack will be removed
  },
  { immediate: true },
);
</script>
<!-- fixme seems a bug on red tokens z-index -->
<!-- fixme tokens arent cleared for demo game -->
<template>
  <div class="current-bet">
    <TransitionGroup
      class="list-base current-bet__chips"
      name="chips"
      tag="ul"
      :class="{
        'current-bet__chips--lost': hasMoneyLost(props.outcome),
        'current-bet__chips--returned': hasMoneyReturned(props.outcome),
      }"
    >
      <li
        v-for="(chip, idx) in betAsChips"
        :key="idx"
        class="current-bet__chip-stacked"
      >
        <BettingChip :value="chip" is-stacked />
      </li>
    </TransitionGroup>

    <small v-show="bet > 0" class="current-bet__value">
      Placed Bet: £{{ bet }} <br />
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

    &--lost {
      animation: fade-up var(--transition-long) both;
    }
    &--returned {
      animation: fade-down var(--transition-long) both;
    }
  }

  &__chip-stacked {
    margin-top: -41px;

    transition: transform var(--transition-short);

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

@keyframes fade-up {
  to {
    transform: translateY(-200px);
    opacity: 0;
  }
}

@keyframes fade-down {
  to {
    transform: translateY(200px);
    opacity: 0;
  }
}

.chips-enter-from {
  transform: translateY(-150px);
}
</style>
