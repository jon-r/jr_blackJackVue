<script setup lang="ts">
import { ButtonControl } from "./button.ts";

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id" | "icon">;

const props = defineProps<ButtonControlProps>();
</script>
<template>
  <button
    type="button"
    class="button-base action-button"
    :class="props.className"
    :disabled="props.disabled"
  >
    <strong class="action-button__label">{{ props.label }}</strong>

    <slot />

    <em
      v-if="props.alert && !props.disabled"
      class="action-button__alert"
    >
      {{ props.alert }}
    </em>
  </button>
</template>
<style>
.action-button {
  flex: 1;
  background-color: var(--md-sys-color-secondary-container);
  padding: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:first-of-type {
    border-radius: var(--gap-md) 0 0 var(--gap-md);
  }
  &:last-of-type {
    border-radius: 0 var(--gap-md) var(--gap-md) 0;
  }

  & + & {
    border-left: 0;
  }

  &:hover {
    background-color: var(--md-sys-color-secondary-hover);
  }
  &:disabled {
    background-color: var(--md-sys-color-disabled);
    opacity: 0.7;
    cursor: not-allowed;
  }
  &--wider {
    flex: 1.5;
  }
  &--good {
    background-color: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-secondary);
  }
  &--alert {
    /* todo maybe need to tone these colours down a bit? */
    background-color: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }

  &__icon {
    margin: auto;
  }

  &__alert {
    color: var(--md-sys-color-on-error);
    font-size: 0.75rem;
  }
}
</style>
