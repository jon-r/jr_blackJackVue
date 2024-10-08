<script setup lang="ts">
import { onMounted, ref } from "vue";

import { NIL_POSITION, SpecialScores } from "~/constants/gamePlay.ts";
import { setElementPosition, transformJiggle } from "~/helpers/style.ts";
import { useDeckStore } from "~/stores/deckStore.ts";
import type { PlayerHand } from "~/types/players.ts";

import PlayingCard from "../common/PlayingCard.vue";

type PlayerCardsProps = {
  hand: PlayerHand;
  isActive: boolean;
};

const deckStore = useDeckStore();
const props = defineProps<PlayerCardsProps>();

const enterPosition = ref(NIL_POSITION);

const frameRef = ref<HTMLDivElement>();

onMounted(() => {
  const { x: deckX, y: deckY } = deckStore.deckPosition;
  const { x, y } = frameRef.value?.getBoundingClientRect() ?? NIL_POSITION;

  enterPosition.value = {
    x: deckX - x,
    y: deckY - y,
  };
});

function onEnter(el: Element) {
  setElementPosition(el, enterPosition.value);
}

function onAfterEnter(el: Element) {
  const offsetX = Number((el as HTMLElement).dataset["index"]) * 30 + 40;
  const jiggle = transformJiggle({ offsetX, offsetY: 40 });
  setElementPosition(el, jiggle);
}

function onLeave(el: Element) {
  (el as HTMLElement).style.opacity = "0";
}
</script>

<template>
  <div
    ref="frameRef"
    class="player-cards"
    :class="{ 'player-cards--active-hand': props.isActive }"
  >
    <TransitionGroup
      appear
      name="cards"
      tag="div"
      @before-enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div
        v-for="(card, idx) in props.hand.cards"
        :key="idx"
        :data-index="idx"
        class="player-cards__card"
      >
        <PlayingCard :card="card" />
      </div>
    </TransitionGroup>

    <small
      v-if="props.isActive && props.hand.score > 0"
      class="player-cards__hand-score"
      :class="{
        'player-cards__hand-score--bust':
          props.hand.special === SpecialScores.Bust,
      }"
    >
      {{ props.hand.score }} {{ props.hand.special }}
    </small>
  </div>
</template>
<style>
.player-cards {
  transition: var(--transition-standard);
  position: absolute;
  inset: 0;

  &:not(&--active-hand) {
    opacity: 0.5;
    filter: grayscale(0.5);
    transform: translateY(70px);
    z-index: -1;
  }

  &__hand-score {
    position: absolute;
    top: var(--padding-lg);
    left: var(--padding-lg);

    border-radius: var(--border-radius-lg);
    padding: 0 var(--padding-xs);
    display: block;
    background-color: var(--md-sys-color-on-primary-container);
    color: var(--md-sys-color-primary-container);

    &--bust {
      background-color: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }
  }

  &__card {
    box-shadow: var(--shadow-level-1);
    position: absolute;
    top: 0;
    left: 0;

    transition:
      transform var(--transition-long),
      opacity var(--transition-short);
  }
}
</style>
