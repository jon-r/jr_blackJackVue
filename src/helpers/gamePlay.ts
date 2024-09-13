import { GameOutcomes } from "~/constants/gamePlay.ts";
import type { Player, PlayerHand } from "~/types/players.ts";

import { hasBlackjack, hasBust, playerMustStand } from "./playerHands.ts";
import { isActivePlayer } from "./players.ts";

function getBestPlayableHand(
  playerHands: PlayerHand[],
): PlayerHand | undefined {
  return playerHands
    .sort((a, b) => b.score - a.score)
    .filter((hand) => !hasBust(hand))
    .at(1);
}

export function getGameOutcome(
  playerHands: PlayerHand[],
  dealerHands: PlayerHand[],
): GameOutcomes {
  const playerHand = getBestPlayableHand(playerHands);

  if (!playerHand) {
    return GameOutcomes.Lost;
  }

  const [dealerHand] = dealerHands;

  const dealerHasBlackjack = hasBlackjack(dealerHand);
  const playerHasBlackjack = hasBlackjack(playerHand);
  const dealerHasBust = hasBust(dealerHand);

  if (
    (dealerHasBlackjack && !playerHasBlackjack) ||
    (dealerHand.score > playerHand.score && !dealerHasBust)
  ) {
    return GameOutcomes.Lost;
  }

  if (dealerHand.score === playerHand.score) {
    return GameOutcomes.Push;
  }

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
