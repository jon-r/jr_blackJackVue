import { AnyPlayer } from "./players.ts";

export type GameConfig = {
  minBet: number;
  autoTime: number;
  deckCount: number;
};

export type NewGameOptions = {
  players: AnyPlayer[];
  config: GameConfig;
};
