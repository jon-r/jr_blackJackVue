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

export const OUTCOME_MULTIPLIER = {
  [GameOutcomes.Blackjack]: 1.5,
  [GameOutcomes.Won]: 1,
  [GameOutcomes.Push]: 0,
  [GameOutcomes.Surrendered]: -0.5,
  [GameOutcomes.Lost]: -1,
} as const;

// todo these shouldn't be needed with proper onClick props
/** @deprecated */
export enum GamePlayActionTypes {
  Hit = "Hit",
  Stand = "Stand",
  Split = "Split",
  Surrender = "Surrender",
  Double = "Double",
}

/** @deprecated */
export enum EndGameActionTypes {
  New = "New Game",
  Next = "Next Round",
}

export const CHIP_VALUES = [1000, 500, 100, 25, 10, 5] as const;
