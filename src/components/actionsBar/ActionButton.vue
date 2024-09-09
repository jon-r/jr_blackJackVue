<script setup lang="ts">
import { ButtonControl } from "./button.ts";

type ButtonControlProps = Omit<ButtonControl, "onClick" | "id">;

const props = defineProps<ButtonControlProps>();
</script>
<!-- todo action button tooltips -->
<template>
  <button
    type="button"
    class="button-base action-button"
    :class="props.className"
    :disabled="props.disabled"
  >
    <strong class="action-button__label">{{ props.label }}</strong>

    <slot />

    <i v-if="props.icon" class="action-button__icon md-icon">{{
      props.icon
    }}</i>

    <em v-if="props.alert" class="action-button__alert">
      <small>{{ props.alert }}</small>
    </em>
  </button>
</template>
<style>
.action-button {
  flex: 1;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  padding: var(--padding-sm);

  display: flex;
  flex-direction: column;
  align-items: center;

  &:first-of-type {
    border-radius: var(--border-radius-xl) 0 0 var(--border-radius-xl);
  }
  &:last-of-type {
    border-radius: 0 var(--border-radius-xl) var(--border-radius-xl) 0;
  }

  & + & {
    border-left: 0;
  }

  &:hover {
    background-color: var(--md-sys-color-primary-container-hover);
  }
  &:disabled {
    background-color: var(--md-sys-color-disabled);
    color: var(--md-sys-color-on-disabled);
    opacity: 0.75;
    cursor: not-allowed;
  }

  &--wider {
    flex: 1.5;
  }

  &--emphasis {
    background-color: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);

    &:hover {
      background-color: var(--md-sys-color-tertiary-container-hover);
    }
  }

  &--warn {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);

    &:hover {
      background-color: var(--md-sys-color-secondary-container-hover);
    }
  }

  &__label {
    min-height: 2em;
  }

  &__icon {
    font-size: var(--font-size-heading-xl);
  }

  &__alert {
    margin-top: auto;
    color: var(--md-sys-color-secondary);
  }
}
</style>
