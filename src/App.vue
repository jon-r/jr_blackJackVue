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
