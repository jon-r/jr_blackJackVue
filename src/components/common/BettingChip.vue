<script setup lang="ts">
import { computed } from "vue";

type BettingChipProps = {
  value: string | number;
  isStacked?: boolean;
};
const props = defineProps<BettingChipProps>();

const href = computed(() => (props.isStacked ? "#chip-tilt" : "#chip"));
</script>
<template>
  <svg
    viewBox="0 0 100 100"
    class="betting-chip"
    :class="'betting-chip--' + value"
  >
    <use :xlink:href="href" />
  </svg>
</template>
<style>
.betting-chip {
  &--5 {
    filter: url(#red);
  }
  &--10 {
    filter: url(#blue);
  }
  &--25 {
    filter: url(#green);
  }
  &--100 {
    filter: url(#black);
  }
  &--500 {
    filter: url(#pink);
  }
  &--1000 {
    filter: url(#yellow);
  }
  &--nil {
    filter: url(#grey);
  }
}
</style>
