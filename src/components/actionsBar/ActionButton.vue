<script setup lang="ts">
export type ButtonControl = {
  id: string;
  label: string;

  icon?: string;
  alert?: string;
  className?: string;
  disabled?: boolean;

  onClick?: () => void;
};

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id" | "icon">;

const props = defineProps<ButtonControlProps>();
</script>
<template>
  <button
    type="button"
    class="ctrl-btn flex-auto"
    :class="props.className"
    :disabled="props.disabled"
  >
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
