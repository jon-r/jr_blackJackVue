<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";

import SvgStatic from "./components/SvgStatic.vue";
import ActionsBar from "./components/actionsBar/ActionsBar.vue";
import MdIcon from "./components/common/MdIcon.vue";
import PlayingCard from "./components/common/PlayingCard.vue";
import TextButton from "./components/common/TextButton.vue";
import OptionsModal from "./components/options/OptionsModal.vue";
import PlayerFrame from "./components/playerFrame/PlayerFrame.vue";
import { useAppStore } from "./store/store.ts";
import { Card } from "./types/card.ts";
import { GamePlayState, useGamePlayStore } from "./stores/gamePlayStore.ts";
import { PlayersState, usePlayersStore } from "./stores/playersStore.ts";
import { GameEvent } from "./types/state.ts";

const store = useAppStore();
const playersStore = usePlayersStore();
const { players, activePlayersCount }: PlayersState = storeToRefs(playersStore);
// const gamePlayStore = useGamePlayStore()
// const {activePlayerId}: GamePlayState = storeToRefs(gamePlayStore)

const showOptions = ref(true);
const messages = ref<{ text: string; idx: number }[]>([]);
const messageIndex = ref(0);

const shoeRef = ref<HTMLDivElement>();

const blankCard: Card = {
  suit: "blank",
  face: 0,
  score: 0,
};

// const activePlayer = computed(
//   () => store.getters.players[activePlayerId],
// );

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
      <MdIcon name="menu" />
    </TextButton>

    <OptionsModal v-if="showOptions" @close-modal="showOptions = false" />

    <main class="blackjack-table flex-auto">
      <TransitionGroup class="announcement frame" name="messages" tag="ul">
        <li class="message" v-for="msg in messages" :key="msg.idx">
          {{ msg.text }}
        </li>
      </TransitionGroup>

      <div class="deck" ref="shoeRef">
        <PlayingCard v-once :card="blankCard" class="stacked" />
      </div>

      <PlayerFrame
        v-if="activePlayersCount > 0"
        v-for="player in players"
        :key="player.index"
        :player="player"
      />
    </main>

    <ActionsBar />

    <SvgStatic v-once />
  </div>
</template>
