import {Card} from "./card.ts";

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
    peeked: Card | null;

    index: number;
    name: string;
    money: number;
    firstBet: number;
    score: number,
    inGame: boolean,
}

export type AnyPlayer = Dealer | Player;
