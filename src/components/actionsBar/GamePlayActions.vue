<script setup lang="ts">
import { computed } from "vue";

import { GamePlayActionTypes } from "../../constants/gamePlay.ts";
import { getHandRules } from "../../helpers/cards.ts";
import { useAppStore } from "../../store/store.ts";
import { ButtonControl } from "../../types/button.ts";
import { Player } from "../../types/players.ts";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";

type GamePlayActionsProps = {
  player: Player;
};

const { dispatch } = useAppStore();
const props = defineProps<GamePlayActionsProps>();

const actionButtons = computed<ButtonControl[]>(() => {
  const { canSplit, canAfford, isFirstPlay } = getHandRules(props.player);
  const { firstBet } = props.player;

  return [
    {
      id: "play-hit",
      label: GamePlayActionTypes.Hit,
      icon: "touch_app",
    },
    {
      id: "play-stand",
      label: GamePlayActionTypes.Stand,
      icon: "pan_tool",
    },
    {
      id: "play-split",
      label: GamePlayActionTypes.Split,
      disabled: !(canAfford && canSplit),
      icon: "call_split",
      alert: `- £${firstBet}`,
    },
    {
      id: "play-surrender",
      label: GamePlayActionTypes.Surrender,
      disabled: !isFirstPlay,
      icon: "flag",
      alert: `+ £${firstBet / 2}`,
    },
    {
      id: "play-double",
      label: GamePlayActionTypes.Double,
      disabled: !(canAfford && isFirstPlay),
      icon: "monetization_on",
      alert: `- £${firstBet}`,
    },
  ];
});

function handleAction(action: GamePlayActionTypes) {
  const { index: idx, name, firstBet } = props.player;

  const handEvent = {
    idx,
    type: "card",
    value: action,
  };

  dispatch("doEvent", handEvent);
  dispatch("setNewMessage", `${name} ${action}s`);

  if (
    action === GamePlayActionTypes.Split ||
    action === GamePlayActionTypes.Double
  ) {
    const betVals = {
      idx,
      value: -firstBet,
    };

    dispatch("playerUpdateMoney", betVals);
  }
}
</script>
<template>
  <section class="ctrl-menu frame flex flex-wrap">
    <ActionButton
      v-for="actionButton in actionButtons"
      :key="actionButton.id"
      v-bind="actionButton"
      @click="() => handleAction(actionButton.label as GamePlayActionTypes)"
    >
      <MdIcon class="ctrl-btn-icon" :name="actionButton.icon!" />
    </ActionButton>
  </section>
</template>
