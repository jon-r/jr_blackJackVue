<script setup lang="ts">
import { computed, ref } from "vue";

import { CHIP_VALUES } from "../../constants/gamePlay.ts";
import { useBetActions } from "../../stores/actions/bets.ts";
import { useGameActions } from "../../stores/actions/game.ts";
import { useCoreStore } from "../../stores/coreStore.ts";
import { Player } from "../../types/players.ts";
import BettingChip from "../common/BettingChip.vue";
import ActionButton from "./ActionButton.vue";
import { ButtonControl } from "./button.ts";

type BettingActionsProps = {
  player: Player;
};
const props = defineProps<BettingActionsProps>();

const coreStore = useCoreStore();
const betActions = useBetActions();
const gameActions = useGameActions();

const chipsToPlace = ref<number[]>([]);
const betToPlace = computed(() =>
  chipsToPlace.value.reduce((a, b) => a + b, 0),
);

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
      className: "action-button--emphasis-variant",
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
  coreStore.sendMessage(`${props.player.name} bets £${betToPlace.value}`);
  betActions.placeBet(betToPlace.value);
  gameActions.goToNextPlayer();

  chipsToPlace.value = [];
}
</script>

<template>
  <!--  <section class="ctrl-menu frame flex flex-wrap">-->
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
  <!--  </section>-->
</template>
