<script setup lang="ts">
import { onMounted, ref } from "vue";

import { UNKNOWN_CARD } from "~/constants/cards.ts";
import { NIL_POSITION } from "~/constants/gamePlay.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { useDeckStore } from "~/stores/deckStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";

import MessagesOutput from "./MessagesOutput.vue";
import PlayingCard from "./common/PlayingCard.vue";
import PlayerFrame from "./playerFrame/PlayerFrame.vue";

const coreStore = useCoreStore();
const playersStore = usePlayersStore();
const deckStore = useDeckStore();

const deckRef = ref<HTMLDivElement>();

function openOptions() {
  coreStore.toggleOptionsModal(true);
}

onMounted(() => {
  const { x, y } = deckRef.value?.getBoundingClientRect() ?? NIL_POSITION;

  deckStore.setDeckPosition({ x, y });
});
</script>
<template>
  <div class="blackjack-table">
    <svg class="blackjack-table__tabletop" viewBox="5 5 215 140">
      <use xlink:href="#tabletop" />
    </svg>

    <MessagesOutput />

    <button
      type="button"
      class="button-base blackjack-table__options-button"
      @click="openOptions"
    >
      <i class="md-icon">menu</i>
    </button>

    <section ref="deckRef" class="blackjack-table__deck">
      <PlayingCard v-once :card="UNKNOWN_CARD" />
    </section>

    <PlayerFrame
      v-for="player in playersStore.players"
      :key="player.index"
      :player="player"
    />
  </div>
</template>
<style>
.blackjack-table {
  flex: 1;
  background-color: var(--md-sys-color-on-primary-fixed-variant);
  color: var(--md-sys-color-primary-fixed-dim);
  position: relative;

  &__tabletop {
    position: absolute;
    inset: 0;
  }

  &__deck {
    position: absolute;
    top: 40px;
    right: 256px;
    transform: rotate(5deg);
    border-radius: 0 0 var(--border-radius-xs) var(--border-radius-xs);
    box-shadow:
      1px 4px 0 0 var(--playing-card-side),
      var(--shadow-level-2);
  }

  &__options-button {
    position: absolute;
    top: var(--padding-lg);
    right: var(--padding-lg);
    width: var(--button-size-lg);
    height: var(--button-size-lg);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-level-2);

    background-color: var(--md-sys-color-tertiary);
    color: var(--md-sys-color-on-tertiary);

    &:hover {
      background-color: var(--md-sys-color-tertiary-hover);
    }
  }
}
</style>
