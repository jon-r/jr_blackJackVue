<script setup lang="ts">
import { ButtonControl } from "../../types/button.ts";

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id">;

const props = defineProps<ButtonControlProps>();
</script>
<template>
  <button
    type="button"
    class="ctrl-btn flex-auto"
    :disabled="!props.canUse"
    :class="props.className"
  >
    <span class="ctrl-btn-title">{{ props.label }}</span>

    <svg v-if="props.svg" viewBox="0 0 100 100">
      <use class="token ctrl-btn-icon" :xlink:href="props.svg" />
    </svg>

    <i v-else-if="props.icon" class="material-symbols-outlined ctrl-btn-icon">
      {{ props.icon }}
    </i>

    <span class="ctrl-btn-alert alert-text" v-if="props.alert">{{
      props.alert
    }}</span>
  </button>
</template>
