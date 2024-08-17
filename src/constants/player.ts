import { Player } from "../types/players.ts";
import { EMPTY_HAND } from "./cards.ts";

export const DEFAULT_PLAYER: Omit<Player, "name" | "index"> = {
  money: 1000,
  firstBet: 0,
  isDealer: false,
  score: 0,
  inGame: true,
  peeked: null,
  hands: [EMPTY_HAND],
  activeHandId: 0,
};
