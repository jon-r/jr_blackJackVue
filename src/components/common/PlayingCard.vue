<script lang="ts" setup>
import { computed } from "vue";

import { CARD_FACES } from "~/constants/cards.ts";
import type { PlayingCard } from "~/types/card.ts";

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
    <template v-if="visualCard.face">
      <strong>{{ visualCard.face }}</strong>
      <svg class="playing-card__face" viewBox="0 0 100 140">
        <use :xlink:href="visualCard.suitId" />
      </svg>
    </template>
  </div>
</template>

<style>
.playing-card {
  --card-back-bg: url(src/assets/card-back.svg) center/cover,
    var(--playing-card-back);

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

  &--blank {
    background: var(--card-back-bg);
  }

  &:not(&--blank) {
    background: var(--md-sys-color-surface);
    animation: flip-card var(--transition-standard)
      var(--transition-duration-standard) both;

    & svg,
    & strong {
      animation: reveal-card var(--transition-standard)
        var(--transition-duration-standard) both;
    }
  }
}

@keyframes flip-card {
  from {
    background: var(--card-back-bg);
  }
  50% {
    background: var(--card-back-bg);
    transform: rotateY(90deg);
  }
  51%,
  to {
    background: var(--md-sys-color-surface);
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
