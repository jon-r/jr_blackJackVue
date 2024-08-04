
export type RawCard = [number, number]

// todo enums
export type Card = {
    face: number | string;
    score: number;
    suit: string;
};

export type PlayerHand =
    { cards: Card[], score: number, revealed: number }
