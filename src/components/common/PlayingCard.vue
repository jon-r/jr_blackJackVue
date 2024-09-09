<script lang="ts" setup>
import { computed } from "vue";

import { CARD_FACES } from "~/constants/cards.ts";
import { PlayingCard } from "~/types/card.ts";

type PlayingCardProps = {
  card: PlayingCard;
};
const props = defineProps<PlayingCardProps>();

const visualCard = computed(() => {
  const [faceValue, suit] = props.card;

  return {
    face: CARD_FACES[faceValue] || faceValue,
    suit: `playing-card--${suit}`,
    suitId: `#card-${suit}`,
  };
});
</script>

<template>
  <div class="playing-card" :class="visualCard.suit">
    <strong v-if="visualCard.face">{{ visualCard.face }}</strong>
    <svg class="playing-card__face" viewBox="0 0 100 140">
      <use :xlink:href="visualCard.suitId" />
    </svg>
  </div>
</template>

<style>
.playing-card {
  width: 50px;
  height: 70px;

  color: var(--md-sys-color-on-surface);
  border-radius: var(--border-radius-xs);
  padding: var(--padding-xs);
  overflow: hidden;
  position: relative;
  line-height: 1;

  &__face {
    position: absolute;
    inset: 0;
  }

  &--hearts,
  &--diamonds {
    color: var(--md-sys-color-error);
  }

  &:not(&--blank) {
    background-color: var(--md-sys-color-surface);
    animation: flip-card var(--transition-standard)
      var(--transition-duration-short) both;

    & svg,
    & strong {
      animation: reveal-card var(--transition-standard)
        var(--transition-duration-short) both;
    }
  }
}

@keyframes flip-card {
  from {
    background-color: var(--playing-card-back);
  }
  50% {
    background-color: var(--playing-card-back);
    transform: rotateY(90deg);
  }
  51%,
  to {
    background-color: var(--md-sys-color-surface);
  }
}

@keyframes reveal-card {
  from,
  50% {
    visibility: hidden;
  }
  to,
  51% {
    visibility: visible;
  }
}
</style>
