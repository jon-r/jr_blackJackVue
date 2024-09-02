<script setup lang="ts">
import { computed } from "vue";

import { GamePlayActionTypes } from "../../constants/gamePlay.ts";
import { getHandRules } from "../../helpers/cards.ts";
import { usePlayerActions } from "../../stores/actions/player.ts";
// import { useAppStore } from "../../store/store.ts";
import { ButtonControl } from "../../types/button.ts";
import { Player } from "../../types/players.ts";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";

type GamePlayActionsProps = {
  player: Player;
};

// const { dispatch } = useAppStore();
const props = defineProps<GamePlayActionsProps>();
const playerActions = usePlayerActions();

const actionButtons = computed<ButtonControl[]>(() => {
  const { canSplit, canSurrender, canDouble } = getHandRules(props.player);
  const { bet } = props.player;

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
      alert: `- £${bet}`,
      onClick: playerActions.split,
    },
    {
      id: "play-surrender",
      label: GamePlayActionTypes.Surrender,
      disabled: !canSurrender,
      icon: "flag",
      alert: `+ £${bet / 2}`,
      onClick: playerActions.surrender,
    },
    {
      id: "play-double",
      label: GamePlayActionTypes.Double,
      disabled: !canDouble,
      icon: "monetization_on",
      alert: `- £${bet}`,
      onClick: playerActions.double,
    },
  ];
});

/*
function handleAction(action: GamePlayActionTypes) {
  const { index: idx, name, firstBet } = props.player;

  const handEvent = {
    idx,
    type: "card",
    value: action,
  };

  store.dispatch("doEvent", handEvent);
  store.dispatch("setNewMessage", `${name} ${action}s`);

  if (
    action === GamePlayActionTypes.Split ||
    action === GamePlayActionTypes.Double
  ) {
    const betVals = {
      idx,
      value: -firstBet,
    };

    store.dispatch("playerUpdateMoney", betVals);
  }
}
*/
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
