<script setup lang="ts">
import { ButtonControl } from "../../types/button.ts";

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id" | "icon">;

const props = defineProps<ButtonControlProps>();
</script>
<template>
  <button type="button" class="ctrl-btn flex-auto">
    <span class="ctrl-btn-title">{{ props.label }}</span>

    <slot />

    <span v-if="props.alert" class="ctrl-btn-alert alert-text">
      {{ props.alert }}
    </span>
  </button>
</template>
