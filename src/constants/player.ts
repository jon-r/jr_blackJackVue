import { Player } from "../types/players.ts";

export const DEFAULT_PLAYER: Omit<Player, "name" | "index"> = {
  money: 1000,
  firstBet: 0,
  isDealer: false,
  score: 0,
  inGame: true,
  peeked: null,
  hands: [],
  activeHandId: 0,
};

export const DEALER: Omit<Player, "index"> = {
  ...DEFAULT_PLAYER,
  name: "Dealer",
  isDealer: true,
};
