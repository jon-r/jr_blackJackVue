<script setup lang="ts">
import MdIcon from "../common/MdIcon.vue";
import TextButton from "../common/TextButton.vue";

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

        <TextButton class="modal-toggle" @click="() => $emit('closeModal')">
          <MdIcon name="close" />
        </TextButton>
      </header>

      <slot />
    </div>
  </div>
</template>
