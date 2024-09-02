<script setup lang="ts">
import { ButtonControl } from "../../types/button.ts";

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id" | "icon">;

const props = defineProps<ButtonControlProps>();
</script>
<!-- todo check if any other props need passing forward -->
<template>
  <button type="button" class="ctrl-btn flex-auto" :disabled="props.disabled">
    <span class="ctrl-btn-title">{{ props.label }}</span>

    <slot />

    <span
      v-if="props.alert && !props.disabled"
      class="ctrl-btn-alert alert-text"
    >
      {{ props.alert }}
    </span>
  </button>
</template>
