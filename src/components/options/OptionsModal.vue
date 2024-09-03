<script setup lang="ts">
import { ref, watch } from "vue";

import { GameStages } from "~/constants/gamePlay.ts";
import { useCoreStore } from "~/stores/coreStore.ts";

import MdIcon from "../common/MdIcon.vue";
import ModalContainer from "./ModalContainer.vue";
import OptionsForm from "./OptionsForm.vue";

// fixme
const coreStore = useCoreStore();
const isOptionsModalOpen = ref(coreStore.activeStage === GameStages.Init);

watch(
  () => coreStore.activeStage,
  function newGameCheck(stage: GameStages) {
    if (stage === GameStages.Init) {
      isOptionsModalOpen.value = true;
    }
  },
);
</script>
<template>
  <button
    type="button"
    class="button-base modal__open"
    @click="isOptionsModalOpen = true"
  >
    <MdIcon name="menu" />
  </button>

  <ModalContainer
    v-if="isOptionsModalOpen"
    title="Let's Play BlackJack!"
    @close-modal="isOptionsModalOpen = false"
  >
    <OptionsForm @close-modal="isOptionsModalOpen = false" />
  </ModalContainer>
</template>

<style>
.modal__open {
  position: absolute;
  top: var(--gap-sm);
  right: var(--gap-sm);
  width: 56px;
  height: 56px;
  border-radius: var(--gap-sm);
  box-shadow: var(--shadow-level2);

  background-color: var(--md-sys-color-tertiary);
  color: var(--md-sys-color-on-tertiary);

  &:hover {
    background-color: var(--md-sys-color-tertiary-hover);
  }
}
</style>
