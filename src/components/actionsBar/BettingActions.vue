<script setup lang="ts">
import { computed, ref } from "vue";

import { CHIP_VALUES } from "~/constants/gamePlay.ts";
import { sum } from "~/helpers/math.ts";
import { useEveryActions } from "~/stores/actions/all.ts";
import { useBetActions } from "~/stores/actions/bets.ts";
import { useGameActions } from "~/stores/actions/game.ts";
import { usePlayerActions } from "~/stores/actions/player.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { Player } from "~/types/players.ts";

import BettingChip from "../common/BettingChip.vue";
import ActionButton from "./ActionButton.vue";
import { ButtonControl } from "./button.ts";

type BettingActionsProps = {
  player: Player;
};
const props = defineProps<BettingActionsProps>();

const coreStore = useCoreStore();
const playerActions = usePlayerActions();

const chipsToPlace = ref<number[]>([]);
const betToPlace = computed(() => sum(chipsToPlace.value));

const chipButtons = computed<ButtonControl[]>(() => {
  const maxChips = props.player.money - betToPlace.value;

  return CHIP_VALUES.map((chip) => ({
    id: `${chip}`,
    label: `£${chip}`,
    disabled: chip > maxChips,
    onClick: () => addChip(chip),
  }));
});

const actionButtons = computed<ButtonControl[]>(() => {
  const { minBet } = coreStore.config;

  return [
    {
      id: "bet-place",
      label: `Place Bet: £${betToPlace.value}`,
      className: "action-button--wider action-button--emphasis",
      icon: "publish",
      disabled: betToPlace.value < minBet,
      onClick: submitBet,
      alert: `Min: £${minBet}`,
    },
    {
      id: "bet-undo",
      label: "Undo",
      className: "action-button--warn",
      icon: "undo",
      disabled: betToPlace.value === 0,
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
  playerActions.submitBet(props.player, betToPlace.value);

  chipsToPlace.value = [];
}
</script>

<template>
  <ActionButton
    v-for="chipButton in chipButtons"
    :key="chipButton.id"
    v-bind="chipButton"
    @click="chipButton.onClick"
  >
    <BettingChip :value="chipButton.disabled ? 'nil' : chipButton.id" />
  </ActionButton>

  <ActionButton
    v-for="actionButton in actionButtons"
    :key="actionButton.id"
    v-bind="actionButton"
    @click="actionButton.onClick"
  />
</template>
