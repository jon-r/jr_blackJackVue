import { BLACKJACK_SCORE } from "../constants/cards.ts";
import { GameOutcomes, SpecialScores } from "../constants/gamePlay.ts";
import { PlayingCard } from "../types/card.ts";
import { GameHand } from "../types/players.ts";
import { getCardScore, isAce, isBlankCard } from "./cards.ts";

export function hasBlackjack(player: GameHand): boolean {
  return player.special === SpecialScores.BlackJack;
}

export function hasBust(player: GameHand): boolean {
  return player.special === SpecialScores.Bust;
}

export function getGameOutcome(
  player: GameHand[],
  dealer: GameHand[],
): GameOutcomes {
  const playerHand = player[0]; // todo find the best non-bust hand
  const dealerHand = dealer[0];

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

function replaceLastBlankCard(
  cards: PlayingCard[],
  newCard: PlayingCard,
): PlayingCard[] {
  const newCardPosition = cards.findIndex(isBlankCard);

  if (newCardPosition !== -1) {
    return cards.toSpliced(newCardPosition, 1, newCard);
  } else {
    return [...cards, newCard];
  }
}

function getHandSpecial(
  { score, softAces }: HandCalculation,
  cardCount: number,
): SpecialScores {
  if (score > BLACKJACK_SCORE) {
    return SpecialScores.Bust;
  }
  if (score === BLACKJACK_SCORE && cardCount === 2) {
    return SpecialScores.BlackJack;
  }
  if (softAces > 0) {
    return SpecialScores.Soft;
  }

  return SpecialScores.None;
}

type HandCalculation = {
  score: number;
  softAces: number;
};

const nilScore = { score: 0, softAces: 0 };

export function getHandScore(cards: PlayingCard[]): HandCalculation {
  if (!cards) {
    return nilScore;
  }

  // todo maybe cleaner way to do this?
  return cards.reduce((prev: HandCalculation, card: PlayingCard) => {
    let { score, softAces } = prev;

    softAces += Number(isAce(card));
    score += getCardScore(card);

    while (score > BLACKJACK_SCORE && softAces > 0) {
      // convert the ace to a 'hard' ace of 1 point
      softAces -= 1;
      score -= 10;
    }

    return { softAces, score };
  }, nilScore);
}

export function updateHand(hand: GameHand, newCard: PlayingCard): GameHand {
  const cards = replaceLastBlankCard(hand.cards, newCard);
  const handScore = getHandScore(cards);
  const special = getHandSpecial(handScore, cards.length);

  return {
    cards,
    special,
    ...handScore,
  };
}
