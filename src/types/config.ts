import { AnyPlayer } from "./players.ts";

export type GameConfig = {
  minBet: number;
  autoTime: number;
  deckCount: number;
  playerCount?: number; // todo temp optional till its removed elsewhere
};

export type NewGameOptions = {
  players: AnyPlayer[];
  config: GameConfig;
};
