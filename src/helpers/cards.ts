import {
  CARDS_PER_SUIT,
  CARD_VALUES,
  FaceValues,
  SUITS_COUNT,
  SUIT_LIST,
} from "~/constants/cards.ts";
import type { PlayingCard } from "~/types/card.ts";

export function getCardScore(rawCard?: PlayingCard): number {
  if (!rawCard) return 0;

  const [faceValue] = rawCard;

  return CARD_VALUES[faceValue] || faceValue;
}

export function isBlankCard([faceValue]: PlayingCard) {
  return faceValue === (FaceValues.Blank as number);
}

export function isAce([faceValue]: PlayingCard) {
  return faceValue === (FaceValues.Ace as number);
}

export function buildDeck(deckCount: number): PlayingCard[] {
  const cards: PlayingCard[] = [];
  const nDecks = Array.from({ length: deckCount });
  const nSuits = Array.from({ length: SUITS_COUNT });
  const nFaces = Array.from({ length: CARDS_PER_SUIT });

  nDecks.forEach(() => {
    nSuits.forEach((_, j) => {
      nFaces.forEach((_, k) => {
        cards.push([k + 1, SUIT_LIST[j]]);
      });
    });
  });

  return cards;
}
