import { Store } from "vuex/types/index.d.ts";

import { GameStages } from "../constants/gamePlay.ts";
import { Position } from "./animations.ts";
import { RawCardOld } from "./card.ts";
import { GameConfig } from "./config.ts";
import { Player } from "./players.ts";

export type GameEvent = {
  idx: number;
  type: string | false;
  value: string;
};

export type AppState = {
  gameRound: number; // todo enums
  gameStage: GameStages;

  gameActivePlayer: number;

  // dealer: Player; // todo use the 'isDealer' to split types?
  players: Player[];
  // activePlayerCount: number;

  deck: RawCardOld[]; // todo probably card
  shoePos: Position;

  config: GameConfig;

  newMessage: string;
  handRules: HandRules;
  eventID: 0;
  eventBus: GameEvent;
};
export type HandRules = {
  count: number;
  split: boolean;
};

export type PlayerMutation = {
  idx: number;
  value: number;
};
export type DoubleBetMutation = {
  idx: number;
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<AppState>;
  }
}
