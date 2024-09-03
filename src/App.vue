<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import SvgStatic from "./components/SvgStatic.vue";
import ActionsBar from "./components/actionsBar/ActionsBar.vue";
import MdIcon from "./components/common/MdIcon.vue";
import PlayingCard from "./components/common/PlayingCard.vue";
import TextButton from "./components/common/TextButton.vue";
import OptionsModal from "./components/options/OptionsModal.vue";
import PlayerFrame from "./components/playerFrame/PlayerFrame.vue";
import { UNKNOWN_CARD } from "./constants/cards.ts";
import { GameStages } from "./constants/gamePlay.ts";
import { useGameActions } from "./stores/actions/game.ts";
import { useCoreStore } from "./stores/coreStore.ts";
import { useDeckStore } from "./stores/deckStore.ts";
import { usePlayersStore } from "./stores/playersStore.ts";

const playersStore = usePlayersStore();
const coreStore = useCoreStore();
const deckStore = useDeckStore();

const gameActions = useGameActions();

const showOptions = ref(coreStore.activeStage === GameStages.Init);

const shoeRef = ref<HTMLDivElement>();

onMounted(() => {
  const { offsetTop, offsetLeft } = shoeRef.value;

  deckStore.setShoePosition({
    x: offsetLeft,
    y: offsetTop,
  });
});

// todo this to be moved to the options frame when they all split up
watch(
  () => coreStore.activeStage,
  (stage) => {
    if (stage === GameStages.Init) {
      showOptions.value = true;
    }
  },
);

// todo maybe move the message to gameActions
watch(
  () => coreStore.activeStage,
  (stage: GameStages) => {
    switch (stage) {
      case GameStages.PlaceBets:
        coreStore.sendMessage("Please place your bets.");
        return gameActions.goToNextPlayer();
      case GameStages.DealCards:
        coreStore.sendMessage("All bets are in, dealing out first cards.");
        return gameActions.dealInitialCards();
      case GameStages.PlayerActions:
        return gameActions.goToNextPlayer();
      case GameStages.DealerActions:
        return gameActions.dealFinalCards();
      case GameStages.EndRound:
        coreStore.sendMessage("Round over. Play again?");
        return gameActions.finaliseRound();
    }
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
        <li
          class="message"
          v-for="(msg, i) in coreStore.notifications"
          :key="i"
        >
          {{ msg }}
        </li>
      </TransitionGroup>

      <div class="deck" ref="shoeRef">
        <PlayingCard v-once :card="UNKNOWN_CARD" class="stacked" />
      </div>

      <div v-if="playersStore.activePlayers.length > 0">
        <PlayerFrame
          v-for="player in playersStore.players"
          :key="player.index"
          :player="player"
        />
      </div>
    </main>

    <ActionsBar />

    <SvgStatic v-once />
  </div>
</template>
