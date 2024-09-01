import { Hand, RawCard } from "./card.ts";

export type Player = {
  isDealer: boolean;
  index: number;
  name: string;
  money: number;
  firstBet: number;
  score: number;
  inGame: boolean;
  peeked: RawCard | null;
  hands: Hand[];
  activeHandId: number;
};

export type PlayerInputStub = Pick<Player, "name">;
