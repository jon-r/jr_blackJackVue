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
  };
});
</script>

<template>
  <div class="playing-card" :class="visualCard.suit">
    <strong v-if="visualCard.face">
      {{ visualCard.face }}
    </strong>
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
  border-radius: 3px;
  padding: 2px;
  overflow: hidden;
  position: relative;

  &--blank {
    background:
      var(--card-back-bg) center/cover,
      var(--playing-card-back);
  }

  &--hearts,
  &--diamonds {
    color: var(--md-sys-color-error);
  }

  &:not(&--blank)::after {
    content: "";
    position: absolute;
    right: -15px;
    bottom: -10px;
    height: 60px;
    width: 60px;
    /* todo inline this like the chips and use currentcolour */
    background-image: var(--card-symbol);
    background-size: 200%;
  }

  &--hearts::after {
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
  }
}
</style>
