import { BLACKJACK_SCORE, DEALER_STAND_SCORE } from "~/constants/cards.ts";
import { SpecialScores } from "~/constants/gamePlay.ts";
import type { HandCalculation, HandRules, PlayingCard } from "~/types/card.ts";
import type {
  Player,
  PlayerHand,
  PlayerHandIdentifier,
} from "~/types/players.ts";

import { getCardScore, isAce, isBlankCard } from "./cards.ts";

export function getHandRules(player: Player): HandRules {
  const { activeHandId, hands, money, openBet } = player;
  const currentHand = hands[activeHandId];

  const { cards } = currentHand;

  const isFirstPlay = cards.length === 2;
  const canAfford = money >= openBet;
  const hasSplitTwice = hands.length > 2;
  const hasMatchingCards = getCardScore(cards[0]) === getCardScore(cards[1]);

  return {
    canSurrender: isFirstPlay,
    canDouble: isFirstPlay && canAfford,
    canSplit: isFirstPlay && canAfford && hasMatchingCards && !hasSplitTwice,
  };
}

export function playerMustStand(hand: PlayerHand, isDealer = false) {
  const standScore = isDealer ? DEALER_STAND_SCORE : BLACKJACK_SCORE;

  return hand.score >= standScore;
}

export function hasBlackjack(hand: PlayerHand): boolean {
  return hand.special === SpecialScores.BlackJack;
}

export function hasBust(hand: PlayerHand): boolean {
  return hand.special === SpecialScores.Bust;
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

const nilScore: HandCalculation = { score: 0, softAces: 0 };

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

export function getHandScore(cards?: PlayingCard[]): HandCalculation {
  if (!cards) {
    return nilScore;
  }

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

function calculateHand(cards: PlayingCard[]): PlayerHand {
  const handScore = getHandScore(cards);
  const special = getHandSpecial(handScore, cards.length);

  return {
    cards,
    special,
    ...handScore,
  };
}

export function addToHand(hand: PlayerHand, newCard: PlayingCard): PlayerHand {
  const cards = replaceLastBlankCard(hand.cards, newCard);

  return calculateHand(cards);
}

export function divideHand(hand: PlayerHand): PlayerHand[] {
  return hand.cards.map((card) => calculateHand([card]));
}

export function createEmptyHand(): PlayerHand {
  return {
    cards: [],
    special: SpecialScores.None,
    score: 0,
    softAces: 0,
  };
}

export function getPlayerHand(
  players: Player[],
  playerId: PlayerHandIdentifier,
): Readonly<PlayerHand> | undefined {
  return players[playerId.index]?.hands[playerId.activeHandId];
}
