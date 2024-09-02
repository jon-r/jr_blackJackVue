import { GameOutcomes, SpecialScores } from "../constants/gamePlay.ts";
import { Hand, RawCard } from "./card.ts";

export type Player = {
  index: number;
  isDealer: boolean;
  name: string;
  money: number;
  bet: number;
  outcome: GameOutcomes | null;
  score: HandScore;
  inGame: boolean;
  peeked: RawCard | null;
  hands: Hand[];
  activeHandId: number;
};

export type PlayerInputStub = Pick<Player, "name">;

export type HandScore = {
  score: number;
  special: SpecialScores;
};
