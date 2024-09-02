import { CardSuits } from "../constants/cards.ts";

export type PlayingCard = [faceValue: number, suit: CardSuits];

// todo remove this. where is it used?
export type Card = {
  face: number | string;
  // score: number;
  suit: string | CardSuits;
};

export type Hand = { cards: PlayingCard[]; revealed: number };

export type HandRules = {
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
};
