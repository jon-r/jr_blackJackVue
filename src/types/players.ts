import { GameOutcomes, SpecialScores } from "../constants/gamePlay.ts";
import { PlayingCard } from "./card.ts";

export type Player = {
  index: number;
  name: string;
  money: number;
  openBet: number;

  outcome: GameOutcomes | null;
  inGame: boolean;
  hands: GameHand[];
  activeHandId: number;
};

export type GameHand = {
  cards: PlayingCard[];
  special: SpecialScores;
  score: number;
  softAces: number;
};

export type PlayerInputStub = Pick<Player, "name">;

export type HandScore = {
  score: number;
  special: SpecialScores;
};
