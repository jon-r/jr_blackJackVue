import type { CardSuits } from "~/constants/cards.ts";

export type PlayingCard = [faceValue: number, suit: CardSuits];

export type HandRules = {
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
};

export type HandCalculation = {
  score: number;
  softAces: number;
};
