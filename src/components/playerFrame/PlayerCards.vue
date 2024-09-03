<script setup lang="ts">
import { computed } from "vue";

import { setPos, transformJiggle } from "../../animationTools.ts";
import { SpecialScores } from "../../constants/gamePlay.ts";
import { useDeckStore } from "../../stores/deckStore.ts";
import { Position } from "../../types/animations.ts";
import { GameHand } from "../../types/players.ts";
import PlayingCard from "../common/PlayingCard.vue";

type PlayerCardsProps = {
  hand: GameHand;
  framePos: Position;
  isActive: boolean;
};

const deckStore = useDeckStore();
const props = defineProps<PlayerCardsProps>();

const enterPosition = computed<Position>(() => {
  const shoe = deckStore.shoePosition;

  return {
    x: shoe.x - props.framePos.x - 36,
    y: shoe.y - props.framePos.y - 70,
  };
});

/*
const leavePosition = computed<Position>(() => ({
  x: -props.framePos.x,
  y: -props.framePos.y - 100, // to go right off the page
}));
*/

// fixme card transitions seem to be problematic. maybe can be handled with just css?
function enter(el: HTMLElement) {
  setPos(el, enterPosition.value);
}
function enterTo(el: HTMLElement) {
  const offsetX = Number(el.dataset.index) * 30;
  const jiggle = transformJiggle({ offsetX });
  setPos(el, jiggle);
}

function leave() {
  // el.addEventListener("transitionend", done);
  // setPos(el, leavePosition.value);
}
</script>

<template>
  <div class="player-cards" :class="{ 'active-hand': isActive }">
    <div
      class="hand-score shadow-light"
      :class="{ 'error-text': hand.special === SpecialScores.Bust }"
    >
      {{ hand.score }} {{ hand.special }}
    </div>

    <TransitionGroup
      appear
      name="cards"
      tag="div"
      @before-enter="enter"
      @after-enter="enterTo"
      @leave="leave"
    >
      <PlayingCard
        v-for="(card, idx) in hand.cards"
        :key="idx"
        :card="card"
        :data-index="idx"
        class="card-outer"
      />
    </TransitionGroup>
  </div>
</template>
