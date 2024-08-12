<script setup lang="ts">
type ModalContainerProps = {
  title: string;
};

const props = defineProps<ModalContainerProps>();
</script>
<template>
  <div
    class="modal-container flex flex-centre"
    @click.self="() => $emit('closeModal')"
  >
    <div class="modal">
      <header class="modal-header frame-thick">
        <h3 class="modal-title">{{ props.title }}</h3>

        <button
          class="text-btn modal-toggle"
          @click="() => $emit('closeModal')"
        >
          <i class="material-symbols-outlined">close</i>
        </button>
      </header>

      <slot />
    </div>
  </div>
</template>
