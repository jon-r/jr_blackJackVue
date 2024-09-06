<script setup lang="ts">
import { ref, watch } from "vue";

import { AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import { staggeredPop, staggeredPush } from "~/helpers/animation.ts";
import { moneyToChips } from "~/helpers/gamePlay.ts";
import { sum } from "~/helpers/math.ts";

import BettingChip from "../common/BettingChip.vue";

type ActiveBetProps = {
  bet: number;
};

const props = defineProps<ActiveBetProps>();
const betAsChips = ref([]);

watch(
  () => props.bet,
  async function staggerChips() {
    let betDiff = props.bet - sum(betAsChips.value);

    if (betDiff > 0) {
      const newChips = moneyToChips(betDiff);

      await staggeredPush(betAsChips.value, newChips, AUTO_TIME_STANDARD);
    } else {
      const chipsToRemove = moneyToChips(Math.abs(betDiff));

      const remainder = await staggeredPop(
        betAsChips.value,
        chipsToRemove,
        AUTO_TIME_STANDARD,
      );

      // fixme needs to return any split chip (this doesnt right now)
      if (remainder) {
        const chipsToReturn = moneyToChips(remainder);
        await staggeredPush(
          betAsChips.value,
          chipsToReturn,
          AUTO_TIME_STANDARD,
        );
      }
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="current-bet">
    <TransitionGroup class="list-base current-bet__chips" name="chips" tag="ul">
      <li
        v-for="(chip, idx) in betAsChips"
        :key="idx"
        class="current-bet__chip-stacked"
      >
        <BettingChip :value="chip" is-stacked />
      </li>
    </TransitionGroup>

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

.chips-enter-from {
  transform: translateY(-150px);
}
</style>
