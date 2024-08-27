<script setup lang="ts">
import { ref, watch } from "vue";

import {
  arrayStaggeredPull,
  arrayStaggeredPush,
  setPos,
} from "../../animationTools.ts";
import { useAppStore } from "../../store/store.ts";
import { Position } from "../../types/animations.ts";
import { Player } from "../../types/players.ts";
import { GameEvent } from "../../types/state.ts";
import BettingChip from "../common/BettingChip.vue";

type ActiveBetProps = {
  player: Player;
  framePos: Position;
};

const store = useAppStore();
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
  () => store.getters.eventBus,
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
  () => store.getters.gameRound,
  function cashIn() {
    hideChips();

    hasEnded.value = false;

    emitMoneyChange(bet.value).then(() => {
      bet.value = 0;

      if (props.player.money < store.getters.config.minBet) {
        store.dispatch("playerEndGame", {
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
  return store.dispatch("playerUpdateMoney", betVals);
}
</script>
<template>
  <div class="player-bet flex">
    <transition-group
      class="chip-stack flex"
      name="bets"
      tag="ul"
      :class="{ show: quidsIn }"
      @after-enter="enterTo"
      @enter="enter"
      @leave="leave"
    >
<!--      <li-->
<!--        v-for="(chip, idx) in chips"-->
<!--        :class="'chip-' + chip"-->
<!--        :key="idx"-->
<!--        :data-key="idx"-->
<!--      >-->
        <BettingChip
          v-for="(chip, idx) in chips"
          :key="idx"
          :value="chip"
          is-stacked
        />
<!--        <svg viewBox="0 0 100 60">
          <use class="token" xlink:href="#chip-tilt" />
        </svg>-->
<!--      </li>-->
    </transition-group>

    <span v-show="bet > 0">Bet: £{{ bet }}</span>
  </div>
</template>
