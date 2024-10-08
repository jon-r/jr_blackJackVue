import type { PlayingCard } from "~/types/card.ts";

export enum FaceValues {
  Blank = 0,
  Ace = 1,
  Jack = 11,
  Queen = 12,
  King = 13,
}

export const CARD_FACES: Record<number, string> = {
  [FaceValues.Ace]: "A",
  [FaceValues.Jack]: "J",
  [FaceValues.King]: "K",
  [FaceValues.Queen]: "Q",
};

export const enum CardSuits {
  Hearts = "hearts",
  Diamonds = "diamonds",
  Spades = "spades",
  Clubs = "clubs",
  Blank = "blank",
}

export const SUIT_LIST = [
  CardSuits.Hearts,
  CardSuits.Diamonds,
  CardSuits.Spades,
  CardSuits.Clubs,
] as const;

export const SUITS_COUNT = SUIT_LIST.length;
export const CARDS_PER_SUIT = 13;

export const UNKNOWN_CARD: PlayingCard = [
  FaceValues.Blank,
  CardSuits.Blank,
] as const;

export const CARD_VALUES: Record<number, number> = {
  [FaceValues.Ace]: 11,
  [FaceValues.Jack]: 10,
  [FaceValues.King]: 10,
  [FaceValues.Queen]: 10,
};

export const FACE_SCORE = 10;
export const BLACKJACK_SCORE = 21;
export const DEALER_STAND_SCORE = 17;
