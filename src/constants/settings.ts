import { GameConfig } from "~/types/config.ts";

export const DEFAULT_SETTINGS: GameConfig = {
  minBet: 100,
  deckCount: 6,
  playerCount: 5,
};

export const MAX_MESSAGES = 5;

// todo fine tune this for different
export const AUTO_TIME = 300;
