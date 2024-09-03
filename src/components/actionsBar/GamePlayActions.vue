<script setup lang="ts">
import { computed } from "vue";

import { GamePlayActionTypes } from "../../constants/gamePlay.ts";
import { getHandRules } from "../../helpers/cards.ts";
import { usePlayerActions } from "../../stores/actions/player.ts";
import { Player } from "../../types/players.ts";
import ActionButton from "./ActionButton.vue";
import { ButtonControl } from "./button.ts";

type GamePlayActionsProps = {
  player: Player;
};

const props = defineProps<GamePlayActionsProps>();
const playerActions = usePlayerActions();

const actionButtons = computed<ButtonControl[]>(() => {
  const { canSplit, canSurrender, canDouble } = getHandRules(props.player);
  const { openBet } = props.player;

  return [
    {
      id: "play-hit",
      label: GamePlayActionTypes.Hit,
      icon: "touch_app",
      onClick: playerActions.hit,
    },
    {
      id: "play-stand",
      label: GamePlayActionTypes.Stand,
      icon: "pan_tool",
      onClick: playerActions.stand,
    },
    {
      id: "play-split",
      label: GamePlayActionTypes.Split,
      disabled: !canSplit,
      icon: "call_split",
      alert: `- £${openBet}`,
      onClick: playerActions.split,
    },
    {
      id: "play-surrender",
      label: GamePlayActionTypes.Surrender,
      disabled: !canSurrender,
      icon: "flag",
      alert: `+ £${openBet / 2}`,
      onClick: playerActions.surrender,
    },
    {
      id: "play-double",
      label: GamePlayActionTypes.Double,
      disabled: !canDouble,
      icon: "monetization_on",
      alert: `- £${openBet}`,
      onClick: playerActions.double,
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
  />
  <!--  </section>-->
</template>
