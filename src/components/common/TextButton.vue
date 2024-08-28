<script setup lang="ts">
type TextButtonProps = {
  iconOnly?: boolean;
};
const props = defineProps<TextButtonProps>();
</script>
<template>
  <button
    type="button"
    :class="['text-button', props.iconOnly && 'text-button--icon-only']"
  >
    <slot />
  </button>
</template>
<style>
.text-button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  color: inherit;
  cursor: pointer;
  font-weight: 400;
  transition: background-color 300ms;

  &--icon-only {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 2rem;
    padding: 0;
  }

  &:hover {
    background-color: var(--md-sys-color-surface-container-low-hover);
  }

  & + & {
    margin-left: var(--gap-sm);
  }
}
</style>
