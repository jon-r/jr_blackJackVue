<!-- todo redo this with RawCard? -->
<script lang="ts" setup>
import { computed } from "vue";

import { CARD_FACES } from "../../constants/cards.ts";
import { RawCard } from "../../types/card.ts";

type PlayingCardProps = {
  card: RawCard;
};
const props = defineProps<PlayingCardProps>();

const visualCard = computed(() => {
  const [faceValue, suit] = props.card;

  return {
    face: CARD_FACES[faceValue] || faceValue,
    suit,
  };
});
</script>

<template>
  <div class="card" :class="visualCard.suit">
    <span v-if="visualCard.face">
      {{ visualCard.face }}
    </span>
  </div>
</template>
