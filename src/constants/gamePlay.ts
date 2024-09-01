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
  Win = "Win",
  Lost = "Lost",
  Push = "Push",
}

export enum GamePlayActionTypes {
  Hit = "hit",
  Stand = "stand",
  Split = "split",
  Surrender = "surrender",
  Double = "double",
}

export enum EndGameActionTypes {
  New = "new game",
  Next = "next round",
}

export const CHIP_VALUES = [1000, 500, 100, 25, 10, 5] as const;
