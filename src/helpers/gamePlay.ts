import { GameOutcomes } from "~/constants/gamePlay.ts";
import type { Player, PlayerHand } from "~/types/players.ts";

import { hasBlackjack, hasBust, playerMustStand } from "./playerHands.ts";
import { isActivePlayer } from "./players.ts";

export function getGameOutcome(
  playerHands: PlayerHand[],
  dealerHands: PlayerHand[],
): GameOutcomes {
  const playerHand = playerHands[0]; // todo multihand
  const dealerHand = dealerHands[0];

  const dealerHasBlackjack = hasBlackjack(dealerHand);
  const playerHasBlackjack = hasBlackjack(playerHand);
  const dealerHasBust = hasBust(dealerHand);
  const playerHasBust = hasBust(playerHand);

  if (
    playerHasBust ||
    (dealerHasBlackjack && !playerHasBlackjack) ||
    (dealerHand.score > playerHand.score && !dealerHasBust)
  ) {
    return GameOutcomes.Lost;
  }

  if (dealerHand.score === playerHand.score) {
    return GameOutcomes.Push;
  }

  // player has winning score at this point

  if (playerHasBlackjack) {
    return GameOutcomes.Blackjack;
  }

  return GameOutcomes.Won;
}

export function mayPlayNext(player: Player) {
  return (
    isActivePlayer(player) &&
    !playerMustStand(player.hands[player.activeHandId])
  );
}
