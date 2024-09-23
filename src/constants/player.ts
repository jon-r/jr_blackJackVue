import type { PlayerInputStub } from "~/types/players.ts";

export const DEALER_ID = { index: 0, activeHandId: 0 } as const;
export const DEALER_STUB: PlayerInputStub = { name: "Dealer" } as const;

export const DEFAULT_PLAYER_NAMES = [
  "Aaron",
  "Beth",
  "Chris",
  "Denise",
  "Ethan",
] as const;
