<script setup lang="ts">
type InputProps = {
  inputId: string;
  label: string;
  icon: string;
  type: string;
  min?: number;
  required?: boolean;
};

const props = defineProps<InputProps>();
const model = defineModel();
</script>

<template>
  <div class="input-field">
    <label class="input-field__label" :for="props.inputId">
      <small>{{ props.label }}</small>
    </label>

    <i class="md-icon">{{ props.icon }}</i>

    <input
      class="input-field__input"
      :type="props.type"
      :id="props.inputId"
      v-model="model"
      :required="props.required"
      :min="props.min"
    />
  </div>
</template>
<style>
.input-field {
  border: solid 1px var(--md-sys-color-outline);
  border-radius: var(--padding-xs);
  position: relative;
  padding: 0 var(--padding-md);
  display: flex;
  align-items: center;
  gap: var(--padding-sm);
  height: 56px;

  &:focus-within {
    color: var(--md-sys-color-primary);
    border-width: 2px;
  }

  &__label {
    position: absolute;
    top: -12px;
    left: 12px;
    padding: 1px var(--padding-xs);
    background-color: var(--md-sys-color-surface-container-highest);
  }

  &__input {
    border: none;
    background: none;
    color: var(--md-sys-color-on-surface);
    caret-color: var(--md-sys-color-primary);
    line-height: 2;
    width: 100%;

    &:focus {
      outline: none;
    }
  }
}
</style>
