import {
  ACE_SCORE,
  BLACKJACK_SCORE,
  CARDS_PER_SUIT,
  CARD_VALUES,
  FACE_SCORE,
  SUITS_COUNT,
  SUIT_LIST,
} from "../constants/cards.ts";
import { SpecialScores } from "../constants/gamePlay.ts";
import { Hand, HandRules, RawCard } from "../types/card.ts";
import { Player } from "../types/players.ts";
import { createEmptyScore } from "./players.ts";

export function getHandRules(player: Player): HandRules {
  const { activeHandId, hands, money, bet } = player;
  const currentHand = hands[activeHandId];

  if (!currentHand) {
    return {
      canSurrender: false,
      canDouble: false,
      canSplit: false,
    };
  }

  const { cards } = currentHand;

  const isFirstPlay = cards.length === 2;
  const canAfford = money >= bet;
  const hasMatchingCards = getCardScore(cards[0]) === getCardScore(cards[1]);

  return {
    canSurrender: isFirstPlay,
    canDouble: isFirstPlay && canAfford,
    canSplit: isFirstPlay && canAfford && hasMatchingCards,
  };
}

export function getCardScore(rawCard: RawCard): number {
  const [faceValue] = rawCard;

  return CARD_VALUES[faceValue] || faceValue;
}

export function isBlankCard([faceValue]: RawCard) {
  return faceValue === 0;
}

type HandCalculation = {
  score: number;
  aces: number;
};

function getHandSpecial(
  cardCount: number,
  calc: HandCalculation,
): SpecialScores {
  if (calc.score > BLACKJACK_SCORE) {
    return SpecialScores.Bust;
  }
  if (cardCount === 2 && calc.score === BLACKJACK_SCORE) {
    return SpecialScores.BlackJack;
  }
  if (calc.aces > 0) {
    return SpecialScores.Soft;
  }
  return SpecialScores.None;
}

type HandScore = {
  score: number;
  special: SpecialScores;
};

export function getHandOutcome(hand?: Hand): HandScore {
  if (!hand) {
    return createEmptyScore();
  }

  const nonBlankCards = hand.cards.filter((card) => !isBlankCard(card));

  const calc = nonBlankCards.reduce(
    (prev: HandCalculation, card: RawCard) => {
      let cardScore = getCardScore(card);

      if (cardScore === ACE_SCORE) {
        if (prev.score > FACE_SCORE) {
          cardScore = 1;
        } else {
          prev.aces += 1;
        }
      }

      return {
        aces: prev.aces,
        score: cardScore + prev.score,
      };
    },
    { score: 0, aces: 0 },
  );

  return {
    score: calc.score,
    special: getHandSpecial(nonBlankCards.length, calc),
  };
}

export function buildDeck(decks: number): RawCard[] {
  const cards: RawCard[] = [];
  const nDecks = new Array(decks).fill(0);
  const nSuits = new Array(SUITS_COUNT).fill(0);
  const nFaces = new Array(CARDS_PER_SUIT).fill(0);

  nDecks.forEach(() => {
    nSuits.forEach((_y, j) => {
      nFaces.forEach((_z, k) => {
        cards.push([k + 1, SUIT_LIST[j]]);
      });
    });
  });

  return cards;
}
