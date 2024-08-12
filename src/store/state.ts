import { GameStages } from "../constants/gamePlay.ts";
import { DEFAULT_PLAYER } from "../constants/player.ts";
import { AppState } from "../types/state.ts";

export function createAppState(): AppState {
  return {
    // game stage ids
    gameRound: -1,
    gameStage: GameStages.Init,
    gameActivePlayer: -1,

    // players & dealer
    dealer: { ...DEFAULT_PLAYER, index: 5, name: "Dealer", isDealer: true },
    players: [
      { ...DEFAULT_PLAYER, index: 0, name: "Aaron" },
      { ...DEFAULT_PLAYER, index: 1, name: "Beth" },
      { ...DEFAULT_PLAYER, index: 2, name: "Chris" },
      { ...DEFAULT_PLAYER, index: 3, name: "Denise" },
      { ...DEFAULT_PLAYER, index: 4, name: "Ethan" },
    ],
    activePlayerCount: 5,

    // deck and cards
    deck: [],
    shoePos: {},

    // other options
    config: {
      minBet: 100,
      autoTime: 250,
      deckCount: 6,
    },

    newMessage: "",

    handRules: {
      count: 0,
      split: false,
    },

    eventID: 0,
    eventBus: {
      idx: -1,
      type: false,
      value: "",
    },
  };
}
