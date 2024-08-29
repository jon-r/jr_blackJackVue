<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import { useAppStore } from "~/store/store.ts";
import { Card } from "~/types/card.ts";

import PlayingCard from "./common/PlayingCard.vue";
import PlayerFrame from "./playerFrame/PlayerFrame.vue";

const store = useAppStore();

const messages = ref<{ text: string; idx: number }[]>([]);
const messageIndex = ref(0);

const shoeRef = ref<HTMLDivElement>();

const blankCard: Card = {
  suit: "blank",
  face: 0,
  score: 0,
};

onMounted(() => {
  const { offsetTop, offsetLeft } = shoeRef.value;

  store.dispatch("setShoePos", {
    x: offsetLeft,
    y: offsetTop,
  });
});

watch(
  () => store.getters.newMessage,
  function updateChat(params: string) {
    const maxMessages = 5;

    messageIndex.value += 1;

    messages.value.unshift({
      text: params,
      idx: messageIndex.value,
    });

    if (messages.value.length > maxMessages) messages.value.pop();
  },
);
</script>
<template>
  <main class="blackjack-table">
    <TransitionGroup class="announcement frame" name="messages" tag="ul">
      <li class="message" v-for="msg in messages" :key="msg.idx">
        {{ msg.text }}
      </li>
    </TransitionGroup>

    <section class="blackjack-table__deck" ref="shoeRef">
      <PlayingCard v-once :card="blankCard" class="stacked" />
    </section>

    <PlayerFrame
      v-for="player in store.getters.players"
      :key="player.index"
      :player="player"
    />
  </main>
</template>
<style>
.blackjack-table {
  flex: 1;
  background: url(../assets/table-print.svg) center/contain no-repeat;
  position: relative;

  &__deck {
    position: absolute;
    top: 40px;
    right: 25%;
    border-radius: 0 0 3px 3px;
    box-shadow:
      0 4px 0 0 var(--playing-card-back-variant),
      var(--shadow-level2);
  }
}
</style>
