import {Store} from "vuex/types/index.d.ts";
import {Dealer, Player} from "./players.ts";
import {GameConfig} from "./config.ts";

export type GameEvent = {
    idx: number;
    type: string | false;
    value: string;
}

export type AppState = {
    gameRound: number; // todo enums
    gameStage: number;

    gameActivePlayer: number;

    dealer: Dealer; // todo use the 'isDealer' to split types?
    players: Player[];
    activePlayerCount: number;

    deck: number[][]; // todo probably card
    shoePos: unknown; //??

    config: GameConfig;

    newMessage: string;
    handRules: HandRules;
    eventID: 0;
    eventBus: GameEvent;
}
export type HandRules = {
    count: number,
    split: boolean,
}

export type PlayerMutation = {
    idx: number;
    value: number;
}
export type DoubleBetMutation = {
    idx: number;
}


declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store<AppState>
    }
}