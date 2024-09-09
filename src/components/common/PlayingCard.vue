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
    suit2: suit,
  };
});
</script>

<template>
  <div class="playing-card" :class="visualCard.suit">
    <svg class="playing-card__face" viewBox="0 0 100 140">
      <use :xlink:href="'#card-' + visualCard.suit2" />
    </svg>

    <!--    <template v-if="visualCard.face">
      <strong>{{ visualCard.face }}</strong>

      &lt;!&ndash;    <svg >&ndash;&gt;
      &lt;!&ndash;      <use :xlink:href="visualCard.face" />&ndash;&gt;
      &lt;!&ndash;    </svg>&ndash;&gt;
    </template>
    <template v-else>
      <svg class="playing-card__back" viewBox="0 0 100 140">
        <use :xlink:href="'#card-' + visualCard.suit" />
      </svg>
    </template>-->
  </div>
</template>

<style>
.playing-card {
  --card-back-bg: url(../../assets/card-back.svg);
  --card-symbol: url(../../assets/card.min.svg);

  width: 50px;
  height: 70px;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--border-radius-xs);
  padding: var(--padding-xs);
  overflow: hidden;
  position: relative;
  line-height: 1;

  /*
  &--blank {
    background: //var(--card-back-bg) center/cover,
      var(--playing-card-back);
  }
  */

  &__face {
    position: absolute;
    inset: 0;
    //background: //var(--card-back-bg) center/cover,
      //  var(--playing-card-back);;
  }

  &--hearts,
  &--diamonds {
    color: var(--md-sys-color-error);
  }

  &:not(&--blank) {
    animation: flip-card var(--transition-standard)
      var(--transition-duration-short) both;

    &::after,
    & strong {
      animation: reveal-card var(--transition-standard)
        var(--transition-duration-short) both;
    }
  }

  /*  &:not(&--blank)::after {
    content: "";
    position: absolute;
    right: -15px;
    bottom: -10px;
    height: 60px;
    width: 60px;
    !* todo inline this like the chips and use currentcolour *!
    background-image: var(--card-symbol);
    background-size: 200%;
  }*/

  /*  &--hearts::after {
    background-position: top left;
  }
  &--diamonds::after {
    background-position: bottom left;
  }
  &--clubs::after {
    background-position: top right;
  }
  &--spades::after {
    background-position: bottom right;
  }*/
}

@keyframes flip-card {
  from {
    background-image: var(--card-back-bg);
  }
  50% {
    background-image: var(--card-back-bg);
    transform: rotateY(90deg);
  }
  51%,
  to {
    background-image: none;
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
