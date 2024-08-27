<script setup lang="ts">
import { ButtonControl } from "../../types/button.ts";
import BettingChip from "../common/BettingChip.vue";

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id">;

const props = defineProps<ButtonControlProps>();
</script>
<template>
  <button
    type="button"
    class="ctrl-btn flex-auto"
  >
    <span class="ctrl-btn-title">{{ props.label }}</span>

    <slot />

    <i v-if="props.icon" class="material-symbols-outlined ctrl-btn-icon">
      {{ props.icon }}
    </i>

    <span class="ctrl-btn-alert alert-text" v-if="props.alert">{{
      props.alert
    }}</span>
  </button>
</template>
