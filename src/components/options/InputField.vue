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
  <div class="input-group flex flex-column frame">
    <input
      :type="props.type"
      :id="props.inputId"
      v-model="model"
      :required="props.required"
      :min="props.min"
    />
    <label :for="props.inputId">
      <i class="material-symbols-outlined">{{ props.icon }}</i>
      {{ props.label }}
    </label>
  </div>
</template>
