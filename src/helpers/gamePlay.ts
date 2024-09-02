import { GameOutcomes, SpecialScores } from "../constants/gamePlay.ts";
import { HandScore } from "../types/players.ts";

function hasBlackjack(player: HandScore): boolean {
  return player.special === SpecialScores.BlackJack;
}

export function hasBust(player: HandScore): boolean {
  return player.special === SpecialScores.Bust;
}

export function getGameOutcome(
  player: HandScore,
  dealer: HandScore,
): GameOutcomes {
  const dealerHasBlackjack = hasBlackjack(dealer);
  const playerHasBlackjack = hasBlackjack(player);
  const dealerHasBust = hasBust(dealer);
  const playerHasBust = hasBust(player);

  if (
    playerHasBust ||
    (dealerHasBlackjack && !playerHasBlackjack) ||
    (dealer.score > player.score && !dealerHasBust)
  ) {
    return GameOutcomes.Lost;
  }

  if (dealer.score === player.score) {
    return GameOutcomes.Push;
  }

  // player has winning score at this point

  if (playerHasBlackjack) {
    return GameOutcomes.Blackjack;
  }

  return GameOutcomes.Won;
}

/*
blackjack win:
natural blackjack AND dealer no natural blackjack

win:
higher than dealer
OR dealer bust

draw:
equal scores (non bust)

lose:
bust 
lower than dealer
dealer blackjack

 */
