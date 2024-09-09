<script setup lang="ts">
import { useCoreStore } from "~/stores/coreStore.ts";

type ModalContainerProps = {
  title: string;
};
const props = defineProps<ModalContainerProps>();
const coreStore = useCoreStore();

function closeModal() {
  coreStore.toggleOptionsModal(false);
}
</script>
<template>
  <div class="modal-backing" @click.self="closeModal">
    <section class="modal">
      <header class="modal__header">
        <h2 class="modal__title">{{ props.title }}</h2>

        <button
          type="button"
          class="button-base modal__close"
          @click="closeModal"
        >
          <i class="md-icon md-icon--lg">close</i>
        </button>
      </header>

      <slot />
    </section>
  </div>
</template>
<style>
.modal-backing {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background-color: var(--md-sys-color-scrim);
}

.modal {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  border-radius: var(--border-radius-xl);
  padding: var(--padding-xl);
  box-shadow: var(--shadow-level-3);

  width: calc(100% - var(--padding-xl));
  max-width: 560px;

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--padding-md);
    align-items: center;
  }

  &__title {
    color: var(--md-sys-color-on-surface);
  }

  &__close {
    width: var(--button-size);
    height: var(--button-size);
    padding: vaR(--padding-xs);
    color: var(--md-sys-color-primary);

    border-radius: var(--border-radius-xl);
    transition: background-color 300ms;

    &:hover {
      background-color: var(--md-sys-color-primary-hover-opacity);
    }
  }
}
</style>
