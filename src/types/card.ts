import { CardSuits } from "../constants/cards.ts";

export type RawCardOld = [faceValue: number, suit: number];
export type RawCard = [faceValue: number, suit: CardSuits];

// todo enums
export type Card = {
  face: number | string;
  score: number;
  suit: string | CardSuits;
};

// export type PlayerHandOld = { cards: Card[]; score: number; revealed: number };

export type Hand = { cards: RawCard[]; revealed: number };

export type HandRules = {
  canAfford: boolean;
  canSplit: boolean;
  isFirstPlay: boolean;
};
