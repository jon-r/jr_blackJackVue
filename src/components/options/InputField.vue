<script setup lang="ts">
import MdIcon from "../common/MdIcon.vue";

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
      {{ props.label }}
    </label>
    <MdIcon :name="props.icon" />
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
  border-radius: 0.25rem;
  position: relative;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 56px;

  &:focus-within {
    color: var(--md-sys-color-primary);
    border-width: 2px;
  }

  &__label {
    position: absolute;
    top: -8px;
    left: 8px;
    padding: 1px;
    font-size: 0.75rem;
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
