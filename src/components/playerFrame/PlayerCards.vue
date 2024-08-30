<script setup lang="ts">
import { computed } from "vue";

import { setPos, transformJiggle } from "../../animationTools.ts";
import {
  ACE_SCORE,
  BLACKJACK_SCORE,
  FaceValues,
} from "../../constants/cards.ts";
import { formatCard, getHandScore } from "../../helpers/cards.ts";
import { useDeckStore } from "../../stores/deckStore.ts";
// import { useAppStore } from "../../store/store.ts";
import { Position } from "../../types/animations.ts";
import { Hand, RawCard } from "../../types/card.ts";
import PlayingCard from "../common/PlayingCard.vue";

type PlayerCardsProps = {
  hand: Hand;
  framePos: Position;
  isActive: boolean;
};

// const store = useAppStore();
const deckStore = useDeckStore();
const props = defineProps<PlayerCardsProps>();
// const emit = defineEmits(["update:modelValue"]);

const formattedCards = computed(() => props.hand.cards.map(formatCard));

const acesCount = computed(
  () =>
    props.hand.cards.filter(
      ([faceValue]: RawCard) => faceValue === FaceValues.Ace,
    ).length,
);

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
const score = computed(() => {
  return getHandScore(props.hand);
  // // const cards = this.cards;
  //
  // if (props.cards.length === 0) return 0;
  //
  // /*  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  // this.aces = cards.reduce(
  //     (count, card) => count + Number(card.face === "A"),
  //     0,
  // );*/
  //
  // let newScore = props.cards.reduce(
  //   (score, [faceValue]: RawCard) => score + faceValue,
  //   0,
  // );
  //
  // let currentAces = acesCount.value;
  // // reduces as many aces as needed (if possible) to keep the score down
  // while (newScore > 21 && currentAces > 0) {
  //   currentAces -= 1;
  //   newScore -= ACE_SCORE;
  // }
  //
  // // fixme remove side effect. move this score stuff to elsewhere
  // emit("update:modelValue", newScore);
  //
  // return newScore;
});

const scoreString = computed(() => {
  switch (true) {
    case score.value > BLACKJACK_SCORE:
      return "Bust";
    case score.value === BLACKJACK_SCORE && props.hand.cards.length === 2:
      return "BlackJack";
    // fixme soft is more complex than this
    case acesCount.value > 0:
      return "Soft";
    default:
      return "";
  }
});

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
  <div class="player-cards" :class="{ 'active-hand': isActive }">
    <div
      class="hand-score shadow-light"
      :class="{ 'error-text': score > BLACKJACK_SCORE }"
    >
      {{ score }} {{ scoreString }}
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
        v-for="(card, idx) in formattedCards"
        :key="idx"
        :card="card"
        :data-index="idx"
        class="card-outer"
      />
    </TransitionGroup>
  </div>
</template>
