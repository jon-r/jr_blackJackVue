<script lang="ts" setup>
import { useCoreStore } from "~/stores/coreStore.ts";

const coreStore = useCoreStore();
</script>
<template>
  <TransitionGroup class="announcement frame" name="messages" tag="ul">
    <li class="message" v-for="(msg, i) in coreStore.notifications" :key="i">
      {{ msg }}
    </li>
  </TransitionGroup>
</template>
