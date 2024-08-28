<script setup lang="ts">
import MdIcon from "../common/MdIcon.vue";
import TextButton from "../common/TextButton.vue";

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

        <TextButton
          class="modal__close"
          @click="() => $emit('closeModal')"
          icon-only
        >
          <MdIcon name="close" />
        </TextButton>
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
  background-color: rgb(0 0 0 / 10%);
}

.modal {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  border-radius: var(--border-radius);
  padding: var(--gap-md);

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
    color: var(--md-sys-color-secondary);
  }
}
</style>
