<script setup lang="ts">
import MdIcon from "../common/MdIcon.vue";

type ModalContainerProps = {
  title: string;
};

const props = defineProps<ModalContainerProps>();
</script>
<template>
  <div class="modal-backing" @click.self="() => $emit('closeModal')">
    <section class="modal">
      <header class="modal__header">
        <h3 class="modal__title">{{ props.title }}</h3>

        <button
          type="button"
          class="button-reset modal__close"
          @click="() => $emit('closeModal')"
        >
          <MdIcon name="close" />
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
  border-radius: var(--border-radius);
  padding: var(--gap-md);
  box-shadow: var(--shadow-level3);

  width: calc(100% - var(--gap-md));
  max-width: 560px;

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--gap-sm);
    align-items: center;
  }

  &__title {
    color: var(--md-sys-color-on-surface);
  }

  &__close {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 2rem;
    color: var(--md-sys-color-secondary);

    border-radius: var(--border-radius);
    transition: background-color 300ms;

    &:hover {
      background-color: var(--md-sys-color-secondary-hover-opacity);
    }
  }
}
</style>
