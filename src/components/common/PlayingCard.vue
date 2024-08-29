<script lang="ts" setup>
import { computed } from "vue";

import { CARD_FACES } from "../../constants/cards.ts";
import { PlayingCard } from "../../types/card.ts";

type PlayingCardProps = {
  card: PlayingCard;
};
const props = defineProps<PlayingCardProps>();

const visualCard = computed(() => {
  const [faceValue, suit] = props.card;

  return {
    face: CARD_FACES[faceValue] || faceValue,
    suit, // todo make class here
  };
});
</script>

<template>
  <div class="playing-card" :class="'playing-card--' + visualCard.suit">
    <span v-if="visualCard.face">
      {{ visualCard.face }}
    </span>
  </div>
</template>

<style>
.playing-card {
  --card-back-bg: url(src/assets/card-back.svg);

  width: 50px;
  height: 70px;
  background: var(--md-sys-color-surface-container-low);
  border-radius: 3px;
  padding: 2px;

  &--blank {
    background:
      var(--card-back-bg) center/cover,
      var(--playing-card-back);
  }
}
</style>
