import { FaceValues } from "~/constants/cards.ts";
import { SpecialScores } from "~/constants/gamePlay.ts";
import type { PlayingCard } from "~/types/card.ts";
import type { Player, PlayerHand } from "~/types/players.ts";

import { isBlankCard } from "./cards.ts";
import { createEmptyHand } from "./playerHands.ts";

export function formatPlayerMessage(
  player: Player,
  action: string,
  card?: PlayingCard,
): string {
  if (action === "hits") {
    const { special, score } =
      player.hands[player.activeHandId] ?? createEmptyHand();

    const message = `${player.name} draws the ${namePlayingCard(card)}. They now have ${score} points`;

    if (special === SpecialScores.Bust) {
      return `${message} and bust!`;
    }

    return message;
  }

  return `${player.name} ${action}.`;
}

export function formatDealerMessage(dealerHand: PlayerHand) {
  const { special, score } = dealerHand;

  if (special === SpecialScores.Bust) {
    return `Dealer has ${score} points and busts!`;
  }
  if (special === SpecialScores.BlackJack) {
    return "Dealer has a BlackJack!";
  }
  return `Dealer has ${score} points.`;
}

function namePlayingCard(card: PlayingCard | undefined): string {
  if (!card || isBlankCard(card)) return "a card";

  const [faceValue, suit] = card;

  return `the ${FaceValues[faceValue] || faceValue} of ${suit}`;
}
