<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

import { GameStages } from "../../constants/gamePlay.ts";
// import { useAppStore } from "../../store/store.ts";
import { useCoreStore } from "../../stores/coreStore.ts";
// import { usePlayersStore } from "../../stores/playersStore.ts";
import { Position } from "../../types/animations.ts";
import { Player } from "../../types/players.ts";
import ActiveBets from "./ActiveBets.vue";
import PlayerHand from "./PlayerHand.vue";

type PlayerFrameProps = {
  player: Player;
};

// const { dispatch } = useAppStore();
// const playersStore = usePlayersStore();
const coreStore = useCoreStore();
const props = defineProps<PlayerFrameProps>();

const playerClass = `player-${props.player.index}`;
const oldMoney = ref(0);
const diffFloat = ref(true);
const framePos = ref<Position>({ x: 0, y: 0 });
const roundResult = ref("");

const frameParent = ref<HTMLElement>();

onMounted(() => {
  const { offsetLeft, offsetTop } = frameParent.value;
  framePos.value = {
    x: offsetLeft,
    y: offsetTop,
  };
});

const diffClass = computed(() => {
  // todo sideffect bad
  triggerTextAnim();
  return moneyDiff.value > 0 ? "good-text" : "error-text";
});

const moneyDiff = computed(() => {
  const out = props.player.money - oldMoney.value;
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  oldMoney.value = props.player.money;
  return out;
});

const isPlayerTurn = computed(() => {
  return coreStore.activePlayerId === props.player.index;
});

watch(isPlayerTurn, function turnCheck() {
  const cantBet = !props.player.inGame;
  const wontBet =
    coreStore.activeStage === GameStages.PlaceBets && props.player.isDealer;

  if (isPlayerTurn.value && (cantBet || wontBet)) {
    coreStore.nextPlayer();
    // store.dispatch("nextPlayer");
  }
});

// watch(
//   () => playersStore.dealer.score,
//   function endRound(dealerScore: number) {
//     if (!dealerScore) return false;
//
//     roundResult.value = getScores();
//
//     emitBetChange(roundResult.value);
//   },
// );

watch(
  () => coreStore.gameRound,
  function cleanUp() {
    roundResult.value = "";
    // todo bonus: anything else can go here?
  },
);

// function emitBetChange(value: string) {
//   const betEvent = {
//     idx: props.player.index,
//     type: "bet",
//     value,
//   };
//
//   dispatch("doEvent", betEvent);
// }

// function getScores() {
//   const dealerScore = playersStore.dealer.score;
//   const playerScore = props.player.score;
//
//   switch (true) {
//     case dealerScore === playerScore:
//       return "push";
//     case playerScore > 21 || dealerScore === 21:
//       return "lose";
//     case dealerScore > 21 || playerScore > dealerScore:
//       return "win";
//     default: // dealerScore > playerScore
//       return "lose";
//   }
// }

function triggerTextAnim() {
  diffFloat.value = false;
  nextTick(() => {
    diffFloat.value = true;
  });
}
</script>

<template>
  <section
    class="player-frame flex flex-column"
    :class="playerClass"
    ref="frameParent"
  >
    <PlayerHand
      v-if="props.player.inGame"
      :result="roundResult"
      :player="props.player"
      :frame-pos="framePos"
      :is-current-turn="isPlayerTurn"
    />

    <ActiveBets
      v-if="!props.player.isDealer"
      :bet="props.player.firstBet"
      :frame-pos="framePos"
    />

    <header
      class="player-frame-title flex frame shadow-light"
      v-if="!props.player.isDealer"
      :class="{ 'is-active': isPlayerTurn }"
    >
      <h4
        class="player-name"
        :class="{
          'alert-text': isPlayerTurn,
          'error-text': !props.player.inGame,
        }"
      >
        {{ props.player.name }}
      </h4>

      <h5 class="player-money">
        £{{ props.player.money }}
        <span :class="[diffClass, { 'diff-float': diffFloat }]">
          £{{ moneyDiff }}
        </span>
      </h5>
    </header>
  </section>
</template>
