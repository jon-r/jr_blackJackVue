<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

import {
  arrayStaggeredPull,
  arrayStaggeredPush,
  setPos,
} from "../../animationTools.ts";
import { useAppStore } from "../../store/store.ts";
import { GamePlayState, useGamePlayStore } from "../../stores/gamePlayStore.ts";
import { Position } from "../../types/animations.ts";
import { Player } from "../../types/players.ts";
import { GameEvent } from "../../types/state.ts";
import BettingChip from "../common/BettingChip.vue";
import {GamePlayState, useGamePlayStore} from "../../stores/gamePlayStore.ts";
import {storeToRefs} from "pinia";

type ActiveBetProps = {
  player: Player;
  framePos: Position;
};

const { dispatch } = useAppStore();
const gamePlayStore = useGamePlayStore();
const {
  gameRound,
  config: { minBet },
}: GamePlayState = storeToRefs(gamePlayStore);
const props = defineProps<ActiveBetProps>();

const bet = ref(0);
const quidsIn = ref(false);
const chips = ref<number[]>([]);
const hasEnded = ref(false);

function enter(el: HTMLElement) {
  setPos(el, { x: 0, y: -200 });
}

function enterTo(el: HTMLElement) {
  requestAnimationFrame(() => {
    setPos(el, { x: 0, y: 0 });
  });
}

function leave(el: HTMLElement, done: () => void) {
  const frame = props.framePos;
  setPos(el, { x: 0, y: -frame.y });
  el.addEventListener("transitionend", () => {
    done();
  });
}

function showChips() {
  quidsIn.value = true;
}

function hideChips() {
  quidsIn.value = false;
}

function calcChips(value: number) {
  const chips = [1000, 500, 100, 25, 10, 5];
  const out = [];

  let i = 0;
  let remainder = value;

  while (i < chips.length) {
    const chip = chips[i];
    if (chip <= remainder) {
      out.push(chip);
      remainder -= chip;
    } else {
      i += 1;
    }
  }
  return out;
}

// todo bonus: make this a computed based on the bet?
function adjustChips(newBet: number) {
  if (newBet === 0) return false;

  const input = calcChips(Math.abs(newBet));
  const args: [number[], number[], number] = [input, chips.value, 100];
  let remaining;

  switch (true) {
    case newBet < 0:
      remaining = arrayStaggeredPull(...args);
      return remaining ? splitChips(remaining) : true;
    case newBet > 0:
      return arrayStaggeredPush(...args);
    default: // no change
      return false;
  }
}

function splitChips(toRemove: number[]) {
  const removeTotal = toRemove.reduce((sum, value) => sum + value, 0);
  const chipsFilter = chips.value.filter((chip) => chip > removeTotal);
  const lowestChip = Math.min(...chipsFilter); // the lowest chip that can be broken down;
  const newChips = calcChips(lowestChip - removeTotal);

  const rm = chips.value.indexOf(lowestChip);
  chips.value.splice(rm, 1);
  setTimeout(() => {
    arrayStaggeredPush(newChips, chips.value, 100);
  }, 100);
}

watch(
  () => null, //store.getters.eventBus,
  function adjustBet(eventBus: GameEvent) {
    const { idx, type, value } = eventBus;
    const isBetEvent = idx === props.player.index && type === "bet";
    const hasNoBet = bet.value === 0 && value !== "addBet";

    if (!isBetEvent || hasNoBet || hasEnded.value) return;

    const betAdjust = {
      addBet: 1,
      forfeit: -0.5,
      lose: -1,
      push: 0,
      win: 1,
      blackJack: 1.5,
    };

    showChips();

    if (value === "blackJack" || value === "forfeit") {
      hasEnded.value = true;
    }

    // @ts-expect-error - will be enum
    const newBet = props.player.firstBet * betAdjust[value];

    adjustChips(newBet);
    bet.value += newBet;
  },
);

watch(
  () => gameRound,
  function cashIn() {
    hideChips();

    hasEnded.value = false;

    emitMoneyChange(bet.value).then(() => {
      bet.value = 0;

      if (props.player.money < minBet) {
        dispatch("playerEndGame", {
          idx: props.player.index,
          value: false,
        });
      }
    });

    setTimeout(() => {
      chips.value = [];
    }, 1000);
  },
);

function emitMoneyChange(value: number) {
  const idx = props.player.index;
  const betVals = { idx, value };
  return dispatch("playerUpdateMoney", betVals);
}
</script>
<template>
  <div class="player-bet flex">
    <TransitionGroup
      class="chip-stack flex"
      name="bets"
      tag="ul"
      :class="{ show: quidsIn }"
      @after-enter="enterTo"
      @enter="enter"
      @leave="leave"
    >
      <BettingChip
        v-for="(chip, idx) in chips"
        :key="idx"
        :value="chip"
        is-stacked
      />
    </TransitionGroup>

    <span v-show="bet > 0">Bet: £{{ bet }}</span>
  </div>
</template>
