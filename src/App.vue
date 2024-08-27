<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import SvgStatic from "./components/SvgStatic.vue";
import ActionsBar from "./components/actionsBar/ActionsBar.vue";
import OptionsModal from "./components/options/OptionsModal.vue";
import PlayerFrame from "./components/playerFrame/PlayerFrame.vue";
import { useAppStore } from "./store/store.ts";
import { GameEvent } from "./types/state.ts";
import PlayingCard from "./components/common/PlayingCard.vue";
import { Card } from "./types/card.ts";
import TextButton from "./components/common/TextButton.vue";

const store = useAppStore();

const showOptions = ref(true);
const messages = ref<{ text: string; idx: number }[]>([]);
const messageIndex = ref(0);

const shoeRef = ref<HTMLDivElement>();

const blankCard: Card = {
  suit: 'blank',
  face: 0,
  score: 0,
}

const activePlayer = computed(
  () => store.getters.players[store.getters.gameActivePlayer],
);

onMounted(() => {
  const { offsetTop, offsetLeft } = shoeRef.value;

  store.dispatch("setShoePos", {
    x: offsetLeft,
    y: offsetTop,
  });
});

watch(
  () => store.getters.eventBus,
  function newGameCheck(event: GameEvent) {
    if (event.type === "newGame") {
      showOptions.value = true;
    }
  },
);

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
  <div class="container flex flex-column">
    <TextButton class="modal-toggle" @click="showOptions = true">
      <i class="material-symbols-outlined">menu</i>
    </TextButton>

    <OptionsModal v-if="showOptions" @close-modal="showOptions = false" />

    <main class="blackjack-table flex-auto">
      <transition-group class="announcement frame" name="messages" tag="ul">
        <li class="message" v-for="msg in messages" :key="msg.idx">
          {{ msg.text }}
        </li>
      </transition-group>

      <div class="deck" ref="shoeRef">
        <PlayingCard v-once :card="blankCard" class="stacked" />
      </div>

      <PlayerFrame
        v-if="store.getters.activePlayerCount > 0"
        v-for="player in store.getters.players"
        :key="player.index"
        :player="player"
      />
    </main>

    <ActionsBar :player="activePlayer" />

    <SvgStatic v-once />
  </div>
</template>
