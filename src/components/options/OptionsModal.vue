<script setup lang="ts">
import { ref, watch } from "vue";

import { useCoreStore } from "../../stores/coreStore.ts";
import TextButton from "../common/TextButton.vue";
import ModalContainer from "./ModalContainer.vue";
import OptionsForm from "./OptionsForm.vue";

// fixme
const coreStore = useCoreStore();
const isOptionsModalOpen = ref(true);

/*
fixme
watch(
  () => store.getters.eventBus,
  function newGameCheck(event: GameEvent) {
    if (event.type === "newGame") {
      isOptionsModalOpen.value = true;
    }
  },
);
*/
</script>
<template>
  <TextButton class="modal-toggle" @click="isOptionsModalOpen = true">
    <MdIcon name="menu" />
  </TextButton>

  <ModalContainer
    v-if="isOptionsModalOpen"
    title="Let's Play BlackJack!"
    @close-modal="isOptionsModalOpen = false"
  >
    <OptionsForm @close-modal="isOptionsModalOpen = false" />
  </ModalContainer>
</template>

<style></style>
