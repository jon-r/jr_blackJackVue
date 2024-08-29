<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

import { Player } from "~/types/players.ts";

type PlayerLabelProps = {
  player: Player;
  isFocused: boolean;
};
const props = defineProps<PlayerLabelProps>();

type DiffObj = {
  diff: number;
  index: number;
  rendered: string;
};

const moneyDiff = ref<DiffObj>({ diff: 0, index: 0, rendered: "" });

watch(
  () => props.player.firstBet,
  async () => {
    await nextTick();
    const newDiff = moneyDiff.value.diff - props.player.firstBet;

    moneyDiff.value = {
      diff: newDiff,
      rendered: `£${newDiff}`,
      index: (moneyDiff.value.index += 1),
    };
  },
);
</script>
<template>
  <header
    class="player-label"
    :class="[props.isFocused && 'player-label--focussed']"
  >
    <h3
      class="player-label__name"
      :class="{
        'alert-text': props.isFocused,
        'error-text': !props.player.inGame,
      }"
    >
      {{ props.player.name }}
    </h3>

    <p class="player-label__money">
      £{{ props.player.money }}

      <Transition name="bet-diff">
        <span
          :key="moneyDiff.index"
          v-if="moneyDiff.index"
          class="player-label__diff"
          :class="[moneyDiff.diff > 0 && 'player-label__diff--returns']"
          >{{ moneyDiff.rendered }}</span
        >
      </Transition>
    </p>
  </header>
</template>

<style>
.player-label {
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-level1);
  padding: 2px var(--gap-md);
  margin-left: -1.5rem;

  display: flex;
  justify-content: space-between;
  align-items: baseline;

  &--focussed {
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }

  &__name {
    font-size: 1.75rem;
  }

  /* todo animate nicer. more transition stuff and easing whatnots
  https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP
      */
  &__diff {
    display: block;
    color: red;
    pointer-events: none;
    position: absolute;

    transition:
      transform 2s,
      opacity 2s;
    transform: translateY(-200px);
    opacity: 0;

    &--returns {
      color: green;
    }
  }
}

.bet-diff-enter-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
