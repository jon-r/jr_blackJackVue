import { DEFAULT_PLAYER_NAMES } from "../constants/player.ts";
import { Hand } from "../types/card.ts";
import { Player, PlayerInputStub } from "../types/players.ts";

export function setupPlayerInput(players: Player[]): PlayerInputStub[] {
  if (!players.length) {
    return DEFAULT_PLAYER_NAMES.map((name) => ({ name }));
  }

  const playersWithoutDealer = players
    .filter((player) => !player.isDealer)
    .map((player) => ({ name: player.name }));

  return Array.from({ ...playersWithoutDealer, length: 5 }, (player) => ({
    name: player.name ?? "",
  }));
}

export function createEmptyHand(): Hand {
  return { cards: [], revealed: 0 };
}

export function createPlayer(name: string, index: number) {
  return {
    index,
    name,
    money: 1000,
    firstBet: 0,
    isDealer: false,
    score: 0,
    inGame: true,
    peeked: null,
    hands: [createEmptyHand()],
    activeHandId: 0,
  };
}

export function isPlayerActive(player: Player) {
  return player.inGame && !player.isDealer;
}
