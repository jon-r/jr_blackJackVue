<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

import { Player } from "~/types/players.ts";

type PlayerLabelProps = {
  player: Player;
  isFocused: boolean;
};
const props = defineProps<PlayerLabelProps>();

const moneyUpdate = ref({
  current: props.player.money,
  diff: 0,
  index: 0,
  rendered: "",
});

watch(
  () => props.player.money,
  async (money: number) => {
    await nextTick();
    const diff = money - moneyUpdate.value.current;

    if (diff === 0) {
      return;
    }

    moneyUpdate.value = {
      current: money,
      diff,
      index: moneyUpdate.value.index + 1,
      rendered: `${diff < 0 ? "-" : "+"}£${diff}`,
    };
  },
);
</script>
<template>
  <header
    class="player-label"
    :class="[
      props.isFocused && 'player-label--focussed',
      !props.player.inGame && 'player-label--disabled',
    ]"
  >
    <h3 class="player-label__name">
      {{ props.player.name }}
    </h3>

    <p class="player-label__money">
      £{{ props.player.money }}

      <Transition name="bet-diff">
        <span
          :key="moneyUpdate.index"
          v-if="moneyUpdate.index"
          class="player-label__diff"
          :class="[moneyUpdate.diff > 0 && 'player-label__diff--returns']"
        >
          {{ moneyUpdate.rendered }}
        </span>
      </Transition>
    </p>
  </header>
</template>

<style>
.player-label {
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-level-1);
  padding: var(--padding-xs) var(--padding-lg);
  opacity: 0.5;
  transition: opacity var(--transition-short);

  display: flex;
  justify-content: space-between;
  align-items: baseline;

  &--focussed {
    opacity: 1;
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }

  &--disabled {
    background-color: var(--md-sys-color-disabled);
    color: var(--md-sys-color-on-disabled);
  }

  &__diff {
    display: block;
    color: var(--md-sys-color-error);
    pointer-events: none;
    position: absolute;

    transition:
      transform var(--transition-long),
      opacity var(--transition-standard) 1s;
    transform: translateY(-4rem);
    opacity: 0;

    &--returns {
      color: var(--md-sys-color-primary-container);
    }
  }
}

.bet-diff-enter-from {
  transform: translateY(-2rem);
  opacity: 1;
}
</style>
