<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { useAppStore } from "../../store/store.ts";
import { CoreState, useCoreStore } from "../../stores/coreStore.ts";
import { ButtonControl } from "../../types/button.ts";
import { Player } from "../../types/players.ts";
import BettingChip from "../common/BettingChip.vue";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";

type BettingActionsProps = {
  player: Player;
};

const { dispatch } = useAppStore();
const coreStore = useCoreStore();
const { config }: CoreState = storeToRefs(coreStore);
const props = defineProps<BettingActionsProps>();

const chips = [5, 10, 25, 100, 500, 1000];

const chipsToPlace = ref<number[]>([]);
const betToPlace = computed(() =>
  chipsToPlace.value.reduce((a, b) => a + b, 0),
);

const chipButtons = computed<ButtonControl[]>(() => {
  const maxChips = props.player.money - betToPlace.value;

  // todo tidy types
  return chips.map((chip) => ({
    id: `${chip}`,
    label: `£${chip}`,
    disabled: chip > maxChips,
    onClick: () => addChip(chip),
  }));
});

const actionButtons = computed<ButtonControl[]>(() => {
  // const { minBet } = store.getters.config;
  return [
    {
      id: "bet-submit",
      label: `Submit: £${betToPlace.value}`,
      class: "btn-good",
      icon: "publish",
      canUse: betToPlace.value >= config.minBet,
      onClick: submitBet,
      alert: `Min: £${config.minBet}`,
    },
    {
      id: "bet-undo",
      label: "Undo",
      class: "btn-alert",
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

// todo move to store
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
  dispatch("setNewMessage", `${props.player.name} bets £${betToPlace.value}`);
  dispatch("playerSetBet", betVals)
    .then(() => dispatch("doEvent", betEvent))
    .then(() => dispatch("nextPlayer"));
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
