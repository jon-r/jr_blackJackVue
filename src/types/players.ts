import { RawCard } from "./card.ts";

export type PlayerInputStub = {
  index: number;
  name: string;
};

export type Player = {
  isDealer: false;

  index: number;
  name: string;
  money: number;
  firstBet: number;
  score: number;
  inGame: boolean;
  peeked: null;
};

export type Dealer = {
  isDealer: true;
  peeked: RawCard | null;

  index: number;
  name: string;
  money: number;
  firstBet: number;
  score: number;
  inGame: boolean;
};

export type AnyPlayer = Dealer | Player;
