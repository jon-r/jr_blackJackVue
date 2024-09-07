import { GameConfig } from "~/types/config.ts";

export const DEFAULT_SETTINGS: GameConfig = {
  minBet: 100,
  deckCount: 6,
  playerCount: 5,
};

export const MAX_MESSAGES = 5;

export const AUTO_TIME_STANDARD = 300;
export const AUTO_TIME_LONG = 450;
