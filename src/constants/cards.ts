import { Hand, RawCard } from "../types/card.ts";

export enum FaceValues {
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

export enum CardSuits {
  Hearts = "hearts",
  Diamonds = "diamonds",
  Spaces = "spades",
  Clubs = "clubs",
  Blank = "blank",
}

export const BLANK_CARD: RawCard = [0, CardSuits.Blank] as const;
export const FACE_SCORE = 10;
export const ACE_SCORE = 11;
export const BLACKJACK_SCORE = 21;
export const DEALER_STAND_SCORE = 17;

export const EMPTY_HAND: Hand = { cards: [] };
