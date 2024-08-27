<script setup lang="ts">
type MdIconProps = {
  name: string;
}
const props = defineProps<MdIconProps>()
</script>
<template>
  <i class="material-symbols-outlined">
    {{ props.name }}
  </i>
</template>