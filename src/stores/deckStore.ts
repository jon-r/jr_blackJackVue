import { defineStore } from "pinia";
import { ref } from "vue";

import { buildDeck } from "~/helpers/cards.ts";
import { getRandom } from "~/helpers/math.ts";
import { Position } from "~/types/animations.ts";
import { PlayingCard } from "~/types/card.ts";

import { useCoreStore } from "./coreStore.ts";

const nilPosition: Position = { x: 0, y: 0 };

export const useDeckStore = defineStore("deck", () => {
  const coreStore = useCoreStore();

  const deck = ref<PlayingCard[]>([]);
  const deckPosition = ref<Position>(nilPosition);

  function rebuildDeck(deckCount = coreStore.config.deckCount) {
    deck.value = buildDeck(deckCount);
  }

  function setDeckPosition(newPosition: Position) {
    deckPosition.value = newPosition;
  }

  function drawCard() {
    const newCardId = getRandom(deck.value.length);
    const [newCard] = deck.value.splice(newCardId, 1);
    return newCard;
  }

  return {
    deck,
    deckPosition,

    setDeckPosition,
    rebuildDeck,
    drawCard,
  };
});
