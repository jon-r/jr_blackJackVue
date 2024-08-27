<script setup lang="ts">
import { computed } from "vue";

import { EndGameActionTypes } from "../../constants/gamePlay.ts";
import { useAppStore } from "../../store/store.ts";
import { ButtonControl } from "../../types/button.ts";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";

const store = useAppStore();

const actionButtons = computed<ButtonControl[]>(() => {
  // todo can do this with filter maybe
  const hasPlayers = store.getters.activePlayerCount > 0;

  return [
    {
      id: "end-new",
      label: EndGameActionTypes.New,
      icon: "skip_previous",
      onClick: newGame,
    },
    {
      id: "end-next",
      label: EndGameActionTypes.Next,
      disabled: !hasPlayers,
      icon: "skip_next",
      onClick: nextRound,
    },
  ];
});

function newGame() {
  const gameEvent = { type: "newGame" };
  return store.dispatch("doEvent", gameEvent);
}

function nextRound() {
  return store.dispatch("nextRound");
}
</script>

<template>
  <section class="ctrl-menu frame flex flex-wrap">
    <ActionButton
      v-for="actionButton in actionButtons"
      :key="actionButton.id"
      v-bind="actionButton"
      @click="actionButton.onClick"
    >
      <MdIcon class="ctrl-btn-icon" :name="actionButton.icon!" />
    </ActionButton>
  </section>
</template>

<style scoped></style>
