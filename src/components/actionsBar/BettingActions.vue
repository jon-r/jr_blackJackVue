<script setup lang="ts">
import { computed, ref } from "vue";

import { useAppStore } from "../../store/store.ts";
import { ButtonControl } from "../../types/button.ts";
import { Player } from "../../types/players.ts";
import ButtonBase from "./ButtonBase.vue";

type BettingActionsProps = {
  player: Player;
};

const store = useAppStore();
const props = defineProps<BettingActionsProps>();

const chips = [5, 10, 25, 100, 500, 1000];

const chipsToPlace = ref<number[]>([]);
const betToPlace = computed(() =>
  chipsToPlace.value.reduce((a, b) => a + b, 0),
);

const chipButtons = computed<ButtonControl[]>(() => {
  const maxChips = props.player.money - betToPlace.value;

  return chips.map((chip) => ({
    id: `bet-${chip}`,
    label: `£${chip}`,
    className: `betting-chip chip-${chip}`,
    svg: "#chip",
    canUse: chip <= maxChips,
    onClick: () => addChip(chip),
  }));
});

const actionButtons = computed<ButtonControl[]>(() => {
  const { minBet } = store.state.config;
  return [
    {
      id: "bet-submit",
      label: `Submit: £${betToPlace.value}`,
      className: "btn-good",
      icon: "publish",
      canUse: betToPlace.value >= minBet,
      onClick: submitBet,
      alert: `Min: £${minBet}`,
    },
    {
      id: "bet-undo",
      label: "Undo",
      className: "btn-alert",
      icon: "undo",
      canUse: betToPlace.value > 0,
      onClick: removeChip,
    },
  ];
});

function addChip(value: number) {
  chipsToPlace.value.push(value);
}
function removeChip() {
  chipsToPlace.value.pop();
}
function submitBet() {
  const idx = props.player.index;

  const betVals = {
    idx,
    value: betToPlace.value,
  };
  const betEvent = {
    idx,
    type: "bet",
    value: "addBet",
  };

  chipsToPlace.value = [];

  // todo bonus combine these in store?
  store.dispatch(
    "setNewMessage",
    `${props.player.name} bets £${betToPlace.value}`,
  );
  store
    .dispatch("playerSetBet", betVals)
    .then(() => store.dispatch("doEvent", betEvent))
    .then(() => store.dispatch("nextPlayer"));
}
</script>

<template>
  <section class="ctrl-menu frame flex flex-wrap">
    <ButtonBase
      v-for="chipButton in chipButtons"
      :key="chipButton.id"
      v-bind="chipButton"
      @click="chipButton.onClick"
    />

    <ButtonBase
      v-for="actionButton in actionButtons"
      :key="actionButton.id"
      v-bind="actionButton"
      @click="actionButton.onClick"
    />
  </section>
</template>
