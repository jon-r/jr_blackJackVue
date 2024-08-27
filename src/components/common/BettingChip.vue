<script setup lang="ts">
import { computed } from "vue";

type BettingChipProps = {
  value: string | number;
  isStacked?: boolean;
};

const props = defineProps<BettingChipProps>();
const viewBox = computed(() =>
  props.isStacked ? "0 0 100 60" : "0 0 100 100",
);
const href = computed(() => (props.isStacked ? "#chip-tilt" : "#chip"));
</script>
<!--todo maybe can redo this so just styles in one element? -->
<template>
  <svg :viewBox="viewBox" :class="'chip-' + value">
    <use class="token" :xlink:href="href" />
  </svg>
</template>
