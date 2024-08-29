<script setup lang="ts">
import BlackjackTable from "~/components/BlackjackTable.vue";
import SvgStatic from "~/components/SvgStatic.vue";
import ActionsBar from "~/components/actionsBar/ActionsBar.vue";
import OptionsModal from "~/components/options/OptionsModal.vue";
</script>

<template>
  <div class="app-container">
    <BlackjackTable />
    <ActionsBar />
  </div>

  <OptionsModal />
  <SvgStatic v-once />
</template>
<style>
.app-container {
  height: 100vh;
  max-height: 768px;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-primary);
  border: solid 1px var(--md-sys-color-outline-variant);
  border-radius: var(--border-radius);
}
</style>
