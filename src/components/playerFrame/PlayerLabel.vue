<script setup lang="ts">
import { Player } from "~/types/players.ts";

type PlayerLabelProps = {
  player: Player;
  isFocused: boolean;
};
const props = defineProps<PlayerLabelProps>();
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

    <span class="player-label__money">
      £{{ props.player.money }}
      <!--     todo redo this animation. maybe theres a better way -->
      <!--     <span :class="[diffClass, { 'diff-float': diffFloat }]">-->
      <!--          £{{ moneyDiff }}-->
      <!--        </span>-->
    </span>
  </header>
</template>

<style>
.player-label {
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-level1);
  padding: 2px var(--gap-md);
  position: absolute;
  bottom: 0;
  left: -1.5rem;
  right: 0;

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
}
</style>
