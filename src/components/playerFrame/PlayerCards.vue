<script setup lang="ts">
// import { computed } from "vue";
import { setPos } from "~/animationTools.ts";
import { SpecialScores } from "~/constants/gamePlay.ts";
import { transformJiggle } from "~/helpers/animation.ts";
import { useDeckStore } from "~/stores/deckStore.ts";
import { Position } from "~/types/animations.ts";
import { GameHand } from "~/types/players.ts";

import PlayingCard from "../common/PlayingCard.vue";

type PlayerCardsProps = {
  hand: GameHand;
  framePos: Position;
  isActive: boolean;
};

const deckStore = useDeckStore();
const props = defineProps<PlayerCardsProps>();

// const enterPosition = computed<Position>(() => {
//   const shoe = deckStore.shoePosition;
//
//   return {
//     x: shoe.x - props.framePos.x - 36,
//     y: shoe.y - props.framePos.y - 70,
//   };
// });

/*
const leavePosition = computed<Position>(() => ({
  x: -props.framePos.x,
  y: -props.framePos.y - 100, // to go right off the page
}));
*/

// fixme card transitions seem to be problematic. maybe can be handled with just css?
function enter(el: HTMLElement) {
  // setPos(el, enterPosition.value);
}
function enterTo(el: HTMLElement) {
  const offsetX = Number(el.dataset.index) * 30 + 40;
  const jiggle = transformJiggle({ offsetX, offsetY: 40 });
  setPos(el, jiggle);
}

function leave() {
  // el.addEventListener("transitionend", done);
  // setPos(el, leavePosition.value);
}
</script>

<template>
  <div
    class="player-cards"
    :class="{ 'player-cards--active-hand': props.isActive }"
  >
    <TransitionGroup
      appear
      name="cards"
      tag="div"
      @before-enter="enter"
      @after-enter="enterTo"
      @leave="leave"
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
  flex: 1;
  transition: 300ms;

  &:not(&--active-hand) {
    opacity: 0.75;
    filter: grayscale(0.5);
    transform: translateY(-10px);
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
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
