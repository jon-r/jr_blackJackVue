<script setup lang="ts">
// import { storeToRefs } from "pinia";
import {
  /*ToRefs, */
  computed,
  ref,
} from "vue";

import { CHIP_VALUES } from "../../constants/gamePlay.ts";
// import { useAppStore } from "../../store/store.ts";
import {
  /*CoreState,*/
  useCoreStore,
} from "../../stores/coreStore.ts";
// import {usePlayersStore} from "../../stores/playersStore.ts";
import { usePlayerBetsStore } from "../../stores/playerBetsStore.ts";
// import { usePlayerCardsStore } from "../../stores/playerCardsStore.ts";
import { ButtonControl } from "../../types/button.ts";
import { Player } from "../../types/players.ts";
import BettingChip from "../common/BettingChip.vue";
import MdIcon from "../common/MdIcon.vue";
import ActionButton from "./ActionButton.vue";

type BettingActionsProps = {
  player: Player;
};
const props = defineProps<BettingActionsProps>();

// const { dispatch } = useAppStore();
const coreStore = useCoreStore();
// const { config }: ToRefs<CoreState> = storeToRefs(coreStore);
// const playersStore = usePlayersStore();
const playerBetsStore = usePlayerBetsStore();

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
      class: "btn-good",
      icon: "publish",
      canUse: betToPlace.value >= minBet,
      onClick: submitBet,
      alert: `Min: £${minBet}`,
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

  playerBetsStore.placeBet(betToPlace.value);

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
