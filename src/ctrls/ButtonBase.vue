<script setup lang="ts">
import {ButtonControl} from "../types/button.ts";

type ButtonControlProps = Omit<ButtonControl, "onClick">

defineProps<ButtonControlProps>();

</script>
<template>
  <button class="ctrl-btn flex-auto" :disabled="!canUse" :class="className">
    <span class="ctrl-btn-title">{{ label }}</span>

    <svg v-if="svg" viewBox="0 0 100 100">
      <use class="token ctrl-btn-icon" :xlink:href="svg" />
    </svg>

    <i v-else-if="icon" class="material-symbols-outlined ctrl-btn-icon">{{
      icon
    }}</i>

    <span class="ctrl-btn-alert alert-text" v-if="alert">{{ alert }}</span>
  </button>
</template>
