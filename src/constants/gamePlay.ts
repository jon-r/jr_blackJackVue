export enum GameStages {
  Init = -1,
  PlaceBets = 0,
  DealOne =1,
  DealTwo = 2,
  PlayerActions = 3,
  DealerActions = 4,
  EndRound = 5
}

export enum GamePlayActionTypes {
  Hit = 'hit',
  Stand = 'stand',
  Split = 'split',
  Surrender = 'surrender',
  Double = 'double'
}

export enum EndGameActionTypes {
  New = 'new game',
  Next = 'next round',
}
