<script setup lang="ts">
import { useCoreStore } from "~/stores/coreStore.ts";

import ModalContainer from "./ModalContainer.vue";
import OptionsForm from "./OptionsForm.vue";

// fixme
const coreStore = useCoreStore();
</script>
<template>
  <ModalContainer
    v-if="coreStore.isOptionsModalOpen"
    title="Let's Play BlackJack!"
  >
    <OptionsForm />
  </ModalContainer>
</template>
