<script setup lang="ts">
import { computed } from "vue";

import { getHandRules } from "~/helpers/playerHands.ts";
import { usePlayerActions } from "~/stores/actions/player.ts";
import type { Player } from "~/types/players.ts";

import ActionButton from "./ActionButton.vue";
import type { ButtonControl } from "./button.ts";

type GamePlayActionsProps = {
  player: Player;
};

const props = defineProps<GamePlayActionsProps>();
const playerActions = usePlayerActions();

const actionButtons = computed<ButtonControl[]>(() => {
  const { canSplit, canSurrender, canDouble } = getHandRules(props.player);
  const { originalBet } = props.player;

  return [
    {
      id: "play-hit",
      label: "Hit",
      icon: "touch_app",
      onClick: () => playerActions.hit(props.player),
      className: "action-button--emphasis",
    },
    {
      id: "play-stand",
      label: "Stand",
      icon: "pan_tool",
      onClick: () => playerActions.stand(props.player),
      className: "action-button--emphasis",
    },
    {
      id: "play-split",
      label: "Split",
      disabled: !canSplit,
      icon: "call_split",
      alert: `- £${originalBet}`,
      onClick: () => playerActions.split(props.player),
    },
    {
      id: "play-surrender",
      label: "Surrender",
      disabled: !canSurrender,
      icon: "flag",
      alert: `+ £${originalBet / 2}`,
      onClick: () => playerActions.surrender(props.player),
    },
    {
      id: "play-double",
      label: "Double",
      disabled: !canDouble,
      icon: "monetization_on",
      alert: `- £${originalBet}`,
      onClick: () => playerActions.double(props.player),
    },
  ];
});
</script>
<template>
  <ActionButton
    v-for="actionButton in actionButtons"
    :key="actionButton.id"
    v-bind="actionButton"
    @click="actionButton.onClick"
  />
</template>
