<script lang="ts" setup>
import { useCoreStore } from "~/stores/coreStore.ts";

const coreStore = useCoreStore();
</script>
<template>
  <TransitionGroup class="list-base messages-output" name="messages" tag="ul">
    <li
      v-for="msg in coreStore.messages"
      :key="msg.id"
      class="messages-output__message"
    >
      {{ msg.value }}
    </li>
  </TransitionGroup>
</template>
<style>
.messages-output {
  position: absolute;
  top: var(--padding-md);
  left: var(--padding-md);

  &__message {
    transition: var(--transition-standard);
    opacity: 1;

    &:first-of-type {
      color: var(--md-sys-color-secondary-fixed);
    }
  }
}

.messages-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}
</style>
