import { defineStore } from "pinia";
// import {buildDeck} from "../deckTools.ts";
import { ref } from "vue";

import { Position } from "../types/animations.ts";
import { RawCardOld } from "../types/card.ts";

// import {useGamePlayStore} from "./gamePlayStore.ts";

export type DeckState = {
  cards: RawCardOld[];

  shoePosition: Position;
};

const nilPosition: Position = { x: 0, y: 0 };

export const useDeckStore = defineStore("deck", () => {
  // const gamePlayStore = useGamePlayStore();

  const cards = ref<RawCardOld[]>([]);
  const shoePosition = ref<Position>(nilPosition);

  function setShoePosition(newPosition: Position) {
    shoePosition.value = newPosition;
  }

  return { cards, shoePosition, setShoePosition };
});
