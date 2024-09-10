import { defineStore } from "pinia";
import { ref } from "vue";

import { NIL_POSITION } from "~/constants/gamePlay.ts";
import { buildDeck } from "~/helpers/cards.ts";
import { getRandom } from "~/helpers/math.ts";
import { Position } from "~/types/animations.ts";
import { PlayingCard } from "~/types/card.ts";

export const useDeckStore = defineStore("deck", () => {
  const deck = ref<PlayingCard[]>([]);
  const deckPosition = ref<Position>(NIL_POSITION);

  function rebuildDeck(deckCount: number) {
    deck.value = buildDeck(deckCount);
  }

  function setDeckPosition(newPosition: Position) {
    deckPosition.value = newPosition;
  }

  function drawCard(): PlayingCard {
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
