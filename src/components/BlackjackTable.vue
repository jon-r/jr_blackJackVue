<script setup lang="ts">
import { onMounted, ref } from "vue";

import { UNKNOWN_CARD } from "~/constants/cards.ts";
import { useDeckStore } from "~/stores/deckStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";

import MessagesOutput from "./MessagesOutput.vue";
import PlayingCard from "./common/PlayingCard.vue";
import PlayerFrame from "./playerFrame/PlayerFrame.vue";

const playersStore = usePlayersStore();
const deckStore = useDeckStore();

const shoeRef = ref<HTMLDivElement>();

onMounted(() => {
  const { offsetTop, offsetLeft } = shoeRef.value;

  deckStore.setShoePosition({
    x: offsetLeft,
    y: offsetTop,
  });
});
</script>
<template>
  <main class="blackjack-table">
    <MessagesOutput />

    <section class="blackjack-table__deck" ref="shoeRef">
      <PlayingCard v-once :card="UNKNOWN_CARD" class="stacked" />
    </section>

    <PlayerFrame
      v-for="player in playersStore.players"
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
