
export type RawCard = [number, number]

export type Card = {
    face: number | string;
    score: number;
};

export type PlayerHand =
    { cards: Card[], score: number, revealed: number }
