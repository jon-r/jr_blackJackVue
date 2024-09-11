import { Position } from "~/types/animations.ts";

export enum GameStages {
  Init = -1,
  PlaceBets = 0,
  DealCards = 1,
  PlayerActions = 2,
  DealerActions = 3,
  EndRound = 4,
}

export enum SpecialScores {
  Bust = "Bust",
  BlackJack = "BlackJack",
  Soft = "Soft",
  None = "",
}

export enum GameOutcomes {
  Blackjack = "Blackjack",
  Won = "Won",
  Lost = "Lost",
  Push = "Push",
  Surrendered = "Surrendered",
}

export const BET_MULTIPLIERS = {
  [GameOutcomes.Blackjack]: 2.5,
  [GameOutcomes.Won]: 2,
  [GameOutcomes.Push]: 1,
  [GameOutcomes.Surrendered]: 0.5,
  [GameOutcomes.Lost]: 0,
} as const;

export const CHIP_VALUES = [1000, 500, 100, 25, 10, 5] as const;

export const NIL_POSITION: Position = { x: 0, y: 0 };
