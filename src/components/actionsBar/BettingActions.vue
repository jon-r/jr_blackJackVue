<script setup lang="ts">
import { computed, ref } from "vue";

import { CHIP_VALUES } from "../../constants/gamePlay.ts";
import { useBetActions } from "../../stores/actions/bets.ts";
// import { useAppStore } from "../../store/store.ts";
import { useCoreStore } from "../../stores/coreStore.ts";
import { ButtonControl } from "../../types/button.ts";
import { Player } from "../../types/players.ts";
import BettingChip from "../common/BettingChip.vue";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";

type BettingActionsProps = {
  player: Player;
};
// const { dispatch } = useAppStore();
const props = defineProps<BettingActionsProps>();

const coreStore = useCoreStore();
const betActions = useBetActions();

// const chips = [5, 10, 25, 100, 500, 1000];

const chipsToPlace = ref<number[]>([]);
const betToPlace = computed(() =>
  chipsToPlace.value.reduce((a, b) => a + b, 0),
);

const chipButtons = computed<ButtonControl[]>(() => {
  const maxChips = props.player.money - betToPlace.value;

  // todo tidy types
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
      id: "bet-submit",
      label: `Submit: £${betToPlace.value}`,
      className: "btn-good",
      icon: "publish",
      disabled: betToPlace.value < minBet,
      onClick: submitBet,
      alert: `Min: £${minBet}`,
    },
    {
      id: "bet-undo",
      label: "Undo",
      className: "btn-alert",
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
  // const idx = props.player.index;

  // const betVals = {
  //   idx,
  //   value: betToPlace.value,
  // };
  // const betEvent = {
  //   idx,
  //   type: "bet",
  //   value: "addBet",
  // };

  coreStore.sendMessage(`${props.player.name} bets £${betToPlace.value}`);
  betActions.placeBet(betToPlace.value);
  coreStore.nextPlayer();

  chipsToPlace.value = [];
  // dispatch("setNewMessage", `${props.player.name} bets £${betToPlace.value}`);
  // dispatch("playerSetBet", betVals)
  //   .then(() => dispatch("doEvent", betEvent))
  //   .then(() => dispatch("nextPlayer"));
}
</script>

<template>
  <section class="ctrl-menu frame flex flex-wrap">
    <ActionButton
      v-for="chipButton in chipButtons"
      :key="chipButton.id"
      v-bind="chipButton"
      @click="chipButton.onClick"
    >
      <BettingChip :value="chipButton.disabled ? 0 : chipButton.id" />
    </ActionButton>

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
