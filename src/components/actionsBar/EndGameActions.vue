<script setup lang="ts">
import { computed } from "vue";

import { EndGameActionTypes } from "../../constants/gamePlay.ts";
import { useGameActions } from "../../stores/actions/game.ts";
import { usePlayersStore } from "../../stores/playersStore.ts";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";
import { ButtonControl } from "./button.ts";

const playersStore = usePlayersStore();
const gameActions = useGameActions();

const actionButtons = computed<ButtonControl[]>(() => {
  return [
    {
      id: "end-new",
      label: EndGameActionTypes.New,
      icon: "skip_previous",
      onClick: gameActions.endGame,
    },
    {
      id: "end-next",
      label: EndGameActionTypes.Next,
      disabled: playersStore.activePlayers.length === 0,
      icon: "skip_next",
      onClick: gameActions.nextRound,
    },
  ];
});
</script>

<template>
  <!--  <section class="ctrl-menu frame flex flex-wrap">-->
  <ActionButton
    v-for="actionButton in actionButtons"
    :key="actionButton.id"
    v-bind="actionButton"
    @click="actionButton.onClick"
  >
    <MdIcon class="ctrl-btn-icon" :name="actionButton.icon!" />
  </ActionButton>
  <!--  </section>-->
</template>

<style scoped></style>
