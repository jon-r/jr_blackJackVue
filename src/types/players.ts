import {RawCard} from "./card.ts";

export type Player = {
    isDealer: false,

    index: number;
    name: string;
    money: number;
    firstBet: number;
    score: number,
    inGame: boolean,
    peaked: null;
}

export type Dealer = {
    isDealer: true,
    peeked: RawCard | null;

    index: number;
    name: string;
    money: number;
    firstBet: number;
    score: number,
    inGame: boolean,
}

export type AnyPlayer = Dealer | Player;
