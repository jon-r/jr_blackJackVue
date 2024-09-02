<script setup lang="ts">
import { computed } from "vue";

import { setPos, transformJiggle } from "../../animationTools.ts";
// import { FaceValues } from "../../constants/cards.ts";
import { SpecialScores } from "../../constants/gamePlay.ts";
// import { getHandOutcome } from "../../helpers/cards.ts";
import { useDeckStore } from "../../stores/deckStore.ts";
// import { useAppStore } from "../../store/store.ts";
import { Position } from "../../types/animations.ts";
import { GameHand } from "../../types/players.ts";
// import { Hand } from "../../types/card.ts";
import PlayingCard from "../common/PlayingCard.vue";

type PlayerCardsProps = {
  hand: GameHand;
  framePos: Position;
  isActive: boolean;
};

// const store = useAppStore();
const deckStore = useDeckStore();
const props = defineProps<PlayerCardsProps>();
// const emit = defineEmits(["update:modelValue"]);

/*
const aces = computed(
  () => props.cards.filter((card) => card.face === "A").length,
);
*/

const enterPosition = computed<Position>(() => {
  const shoe = deckStore.shoePosition;

  return {
    x: shoe.x - props.framePos.x - 36,
    y: shoe.y - props.framePos.y - 70,
  };
});

const leavePosition = computed<Position>(() => ({
  x: -props.framePos.x,
  y: -props.framePos.y - 100, // to go right off the page
}));

// fixme bug if 10 or face on soft (it doesnt update the score)
// also remove the aces side-effect
// const outcome = computed(() => getHandOutcome(props.hand));

/*
const score = computed(() => {
  // const cards = this.cards;

  if (props.cards.length === 0) return 0;

  /*  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  this.aces = cards.reduce(
      (count, card) => count + Number(card.face === "A"),
      0,
  );*

  let newScore = props.cards.reduce((score, card) => score + card.score, 0);

  let currentAces = aces.value;
  // reduces as many aces as needed (if possible) to keep the score down
  while (newScore > 21 && currentAces > 0) {
    currentAces -= 1;
    newScore -= 10;
  }

  // fixme remove side effect
  emit("update:modelValue", newScore);

  return newScore;
});

const scoreString = computed(() => {
  switch (true) {
    case score.value > 21:
      return "Bust";
    case score.value === 21 && props.cards.length < 3:
      return "BlackJack";
    case aces.value > 0:
      return "Soft";
    default:
      return "";
  }
});
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

function leave(el: HTMLElement, done: () => void) {
  el.addEventListener("transitionend", done);
  setPos(el, leavePosition.value);
}
</script>

<template>
  <small> {{ hand.score }}</small>
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
      <!-- FIXME fully revisit how cards + chips style works -->
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
