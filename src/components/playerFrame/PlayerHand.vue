<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

import {
  BLACKJACK_SCORE,
  DEALER_STAND_SCORE,
  FACE_VALUE,
} from "../../constants/cards.ts";
import { GameStages } from "../../constants/gamePlay.ts";
import { blankCard, valueCard } from "../../deckTools.ts";
// import { useAppStore } from "../../store/store.ts";
import { CoreState, useCoreStore } from "../../stores/coreStore.ts";
import { usePlayersStore } from "../../stores/playersStore.ts";
import { Position } from "../../types/animations.ts";
import { Card, Hand, RawCard } from "../../types/card.ts";
import { Player } from "../../types/players.ts";
import { GameEvent } from "../../types/state.ts";
import PlayerCards from "./PlayerCards.vue";

type PlayerHandProps = {
  isCurrentTurn: boolean;
  player: Player;
  framePos: Position;
  result: string;
};

// const playersStore = usePlayersStore();
// const {} = storeToRefs(playersStore)
const coreStore = useCoreStore();
const {
  activeStage,
  gameRound,
  config: { autoTime },
}: CoreState = storeToRefs(coreStore);
const props = defineProps<PlayerHandProps>();

// const hands = ref<PlayerHandOld[]>([]);
// const activeHandId = ref(-1);
const message = ref("");

const activeHand = computed(
  () => props.player.hands[props.player.activeHandId],
);

const activeScore = computed(() => {
  if (!activeHand.value) {
    return 0;
  }
  return activeHand.value.cards.reduce((acc: number, card) => {
    const [value] = card;
    return acc + Math.min(value[0], FACE_VALUE);
  }, 0);
});

// todo this should all be handled in a watcher function
const allowPlay = computed(() => {
  // const activeHand = props.player.hands[props.player.activeHandId]
  if (!activeScore.value) {
    return false;
  }

  const max = props.player.isDealer ? DEALER_STAND_SCORE : BLACKJACK_SCORE;

  // const activeScore = activeHand.value.score;
  if (activeScore.value > BLACKJACK_SCORE) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    message.value = "Bust";
  } else if (
    activeScore.value === BLACKJACK_SCORE &&
    activeHand.value.cards.length === 2
  ) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    message.value = "BlackJack!";
    emitBetChange("blackJack");
  }

  cardMessage(activeHand.value, message.value);
  return activeScore.value < max;
});

const roundResult = computed(() => {
  return message.value || props.result || "";
});

// function wait<T>(time: number, resolved: T): Promise<T> {
//   return new Promise((resolve) => setTimeout(() => resolve(resolved), time));
// }

/* hand methods */
function addHand() {
  // hands.value.push({ cards: [], score: 0, revealed: 0 });
}

function addSplitHand(splitCard: Card) {
  // addHand();
  // nextHand();
  // setCard(splitCard, true);
}

function nextHand() {
  // if (hands.value.length - 1 === activeHandId.value) {
  //   emitEndTurn();
  // } else {
  //   activeHandId.value += 1;
  // }
}

function prevHand() {
  // activeHandId.value -= 1;
}

/* card methods */

function addBlankCard() {
  // activeHand.value.cards.push(blankCard);
}

function revealCard(mayPeek = false): Promise<RawCard> {
  // const drawType = mayPeek ? "deckDrawPeek" : "deckDrawRandom";
  //
  // return store.dispatch(drawType, activeHand.value.score);
}

// fixme this looks sus
function setCard(card: RawCard | Card, isPreset = false) {
  // if (!card) return;
  //
  // const newCard = isPreset ? card : valueCard(card as RawCard);
  //
  // activeHand.value.cards.splice(activeHand.value.revealed, 1, newCard as Card);
  //
  // activeHand.value.revealed += 1;
}

async function dealRevealSet(mayPeek = false) {
  // addBlankCard();
  // const rawCard = await revealCard(mayPeek);
  // await wait(autoTime, null);
  // setCard(rawCard);
}

async function fillBlanks() {
  // const hasBlank = activeHand.value.cards.length > activeHand.value.revealed;
  //
  // if (!hasBlank) return;
  //
  // const rawCard = await revealCard();
  // await wait(autoTime, null);
  // setCard(rawCard);
}

/* turn setting -------------- */
watch(
  () => props.isCurrentTurn,
  function startTurn(turn: boolean) {
    // if (!turn) return false;
    //
    // const actions = new Map<GameStages, () => void>([
    //   [GameStages.DealOne, dealOutFirst],
    //   [GameStages.DealTwo, dealOutSecond],
    //   [GameStages.PlayerActions, playerActions],
    //   [GameStages.DealerActions, dealOutLast],
    //   //       [5, this.roundResult],
    // ]);
    //
    // const fn = actions.get(activeStage);
    //
    // return fn?.();
  },
);

/* TURN 0 ------------------ */
watch(
  () => gameRound,
  function clearTable() {
    // hands.value.forEach((hand) => {
    //   hand.cards = [];
    // });
    // message.value = "";
    //
    // setTimeout(() => {
    //   hands.value = [];
    //   activeHandId.value = -1;
    // }, 2000);
  },
);

/* TURN 1 ------------------ */

async function dealOutFirst() {
  // activeHandId.value = 0;
  // addHand();
  // await wait(100, null);
  // await dealRevealSet();
  // emitEndTurn();
}

/* TURN 2 ------------------ */

async function dealOutSecond() {
  // const isDealer = props.player.isDealer;
  //
  // await dealRevealSet(isDealer);
  //
  // const endImmediately = isDealer && activeHand.value.score === 21;
  //
  // if (endImmediately) {
  //   await wait(autoTime, null);
  //   emitEndRound();
  // } else {
  //   emitEndTurn();
  // }
}

/* TURN 3 -------------------- */

function updateRules() {
  // const count = activeHand.value.revealed;
  // const split =
  //   count === 2 &&
  //   activeHand.value.cards[0].face === activeHand.value.cards[1].face;
  // store.dispatch("handCtrlRules", { count, split });
}

function scoreCheck() {
  // updateRules();
  // if (!allowPlay.value) {
  //   nextHand();
  // }
}

async function playerActions() {
  // if (!props.player.isDealer) {
  //   return scoreCheck();
  // }
  //
  // const peekedCard = playersStore.dealer.peeked;
  // if (peekedCard) {
  //   setCard(peekedCard);
  //   // .wait(0, null) todo why wait here?
  //   await autoHit();
  // }
  //
  // await fillBlanks();
  // await autoHit();
}

watch(
  () => null, //store.getters.eventBus,
  function doCtrl(event: GameEvent) {
    // const { idx, type, value } = event;
    // const isHandEvent = idx === props.player.index && type === "card";
    //
    // const events = {
    //   hit,
    //   stand,
    //   split,
    //   surrender,
    //   double,
    // };
    //
    // // @ts-expect-error - do this better
    // if (isHandEvent) events[value]();
  },
);

async function hit() {
  // await dealRevealSet();
  // scoreCheck();
}

async function autoHit() {
  // if (allowPlay.value) {
  //   await dealRevealSet();
  //   await wait(autoTime, null);
  //   await autoHit();
  // } else {
  //   emitEndTurn();
  // }
}

function stand() {
  // // wait(0, null) todo why wait
  // nextHand();
}

async function split() {
  // const splitCard = activeHand.value.cards.splice(1)[0];
  // activeHand.value.revealed -= 1;
  //
  // await emitBetChange("addBet");
  //
  // await dealRevealSet();
  // addSplitHand(splitCard);
  // await wait(100, null);
  // await dealRevealSet();
  // prevHand();
  // scoreCheck();
}

async function surrender() {
  // await emitBetChange("forfeit");
  // emitEndTurn();
}

async function double() {
  // addBlankCard();
  // await emitBetChange("addBet");
  //
  // await store.dispatch("playerDoubleBet", { idx: props.player.index });
  // // needed to change the bet AFTER adding. to avoid double dipping
  // emitEndTurn();
}

/* TURN 4 ------------------------- */

async function dealOutLast() {
  // await fillBlanks();
  // setFinalScores();
  // emitEndTurn();
}

function setFinalScores() {
  // also filtering out any bust scores
  // const bestScore = hands.value
  //   .map((hand) => hand.score)
  //   .reduce((max, cur) => (cur > 21 ? max : Math.max(max, cur)), -1);
  //
  // emitFinalScore(bestScore);
}

/* emits -------------------------------------------------------------*/

function emitEndTurn() {
  // gamePlayStore.nextPlayer();
  // store.dispatch("nextPlayer");
}

function emitEndRound() {
  // store.dispatch("setStage", 3);
  // store.dispatch("nextPlayer");
  // gamePlayStore.nextPlayer()
  // gamePlayStore.endAllPlayerTurns();
}

function emitBetChange(value: string) {
  // const betEvent = {
  //   idx: props.player.index,
  //   type: "bet",
  //   value,
  // };
  //
  // return store.dispatch("doEvent", betEvent);
}

function emitFinalScore(value: number) {
  // const idx = props.player.index;
  // store.dispatch("playerSetScore", { idx, value });
}

/* messenger ---------------------------------------------------------*/

function cardMessage(hand: Hand, outcome: string) {
  // const has = hand.revealed === 2 ? "starts with" : "now has";
  //
  // const msg = `${props.player.name} ${has} ${hand.score}. ${outcome}`;
  //
  // store.dispatch("setNewMessage", msg);
}
</script>

<template>
  <div class="player-hand frame flex-auto flex flex-column">
    <PlayerCards
      v-for="(hand, idx) in player.hands"
      :key="idx"
      :frame-pos="props.framePos"
      :cards="hand.cards"
      :is-active="idx === player.activeHandId"
    >
    </PlayerCards>
    <div class="round-alert alert-text" v-if="roundResult && !player.isDealer">
      {{ roundResult }}
    </div>
  </div>
</template>
