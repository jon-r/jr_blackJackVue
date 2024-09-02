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

  /** @deprecated todo replace with openBet */
  bet: number;
  /** @deprecated todo remove */
  score: HandScore;
  /** @deprecated todo remove */
  peeked: PlayingCard | null;
  /** @deprecated todo remove */
  isDealer: boolean; // (use index === 0)
};

export type GameHand = {
  cards: PlayingCard[];
  special: SpecialScores;
  score: number;
  softAces: number;

  /** @deprecated todo remove */
  revealed: number; // todo remove (use findIndex on cards)
};

export type PlayerInputStub = Pick<Player, "name">;

export type HandScore = {
  score: number;
  special: SpecialScores;
};
