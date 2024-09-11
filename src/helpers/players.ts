import { DEALER_ID, DEFAULT_PLAYER_NAMES } from "~/constants/player.ts";
import { Player, PlayerInputStub } from "~/types/players.ts";

import { createEmptyHand } from "./playerHands.ts";

export function setupPlayerInput(players: Player[]): PlayerInputStub[] {
  if (!players.length) {
    return DEFAULT_PLAYER_NAMES.map((name) => ({ name }));
  }

  const playersWithoutDealer = players
    .filter(isNotDealer)
    .map((player) => ({ name: player.name }));

  return Array.from({ ...playersWithoutDealer, length: 5 }, (player) => ({
    name: player.name ?? "",
  }));
}

export function createPlayer({ name }: PlayerInputStub, index: number): Player {
  return {
    name,
    index,
    money: 1000,
    openBet: 0,
    inGame: true,
    hands: [createEmptyHand()],
    outcome: null,
    activeHandId: 0,
    peekedCard: null,
  };
}

export function isActivePlayer(player: Player) {
  return player.inGame && isNotDealer(player);
}

export function isNotDealer(player: Player) {
  return player.index !== DEALER_ID.index;
}
