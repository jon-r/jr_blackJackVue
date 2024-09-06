<script lang="ts" setup>
import { useCoreStore } from "~/stores/coreStore.ts";

const coreStore = useCoreStore();
</script>
<!-- todo animate this once more messages to fill out a bit -->
<template>
  <!--  <TransitionGroup class="announcement frame" name="messages" tag="ul">-->
  <ul class="list-base messages-output">
    <li
      class="messages-output__message"
      v-for="(msg, i) in coreStore.notifications"
      :key="i"
    >
      {{ msg }}
    </li>
  </ul>
  <!--  </TransitionGroup>-->
</template>
<style>
.messages-output {
  position: absolute;
  top: var(--padding-md);
  left: var(--padding-md);

  &__message {
    &:first-of-type {
      color: var(--md-sys-color-primary-container);
    }
  }
}
</style>
