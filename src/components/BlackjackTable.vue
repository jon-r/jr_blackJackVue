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
  <main class="blackjack-table flex-auto">
    <TransitionGroup class="announcement frame" name="messages" tag="ul">
      <li class="message" v-for="msg in messages" :key="msg.idx">
        {{ msg.text }}
      </li>
    </TransitionGroup>

    <section class="deck" ref="shoeRef">
      <PlayingCard v-once :card="blankCard" class="stacked" />
    </section>

    <PlayerFrame
      v-if="store.getters.activePlayerCount > 0"
      v-for="player in store.getters.players"
      :key="player.index"
      :player="player"
    />
  </main>
</template>
