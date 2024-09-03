import { PlayerInputStub } from "../types/players.ts";

export const DEALER_ID = 0;
export const DEALER_STUB: PlayerInputStub = { name: "Dealer" } as const;

export const DEFAULT_PLAYER_NAMES = Object.freeze([
  "Aaron",
  "Beth",
  "Chris",
  "Denise",
  "Ethan",
]);
