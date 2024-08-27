<script lang="ts" setup>
import { Card } from "../../types/card.ts";

type PlayingCardProps = {
  card: Card;
};
const props = defineProps<PlayingCardProps>();
</script>

<template>
  <div class="card" :class="props.card.suit">
    <span v-if="props.card.face">
      {{ props.card.face }}
    </span>
  </div>
</template>
