import { GameOutcomes, SpecialScores } from "~/constants/gamePlay.ts";

import { PlayingCard } from "./card.ts";

export type Player = {
  index: number;
  name: string;
  money: number;
  openBet: number;

  outcome: GameOutcomes | null;
  inGame: boolean;
  hands: PlayerHand[];
  activeHandId: number;
  peekedCard: PlayingCard | null;
};

export type PlayerHand = {
  cards: PlayingCard[];
  special: SpecialScores;
  score: number;
  softAces: number;
};

export type PlayerIdentifier = Readonly<{
  index: number;
}>;

export type PlayerHandIdentifier = Readonly<{
  index: number;
  activeHandId: number;
}>;

export type PlayerInputStub = Pick<Player, "name">;
