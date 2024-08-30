import {
  ACE_SCORE,
  CARDS_PER_SUIT,
  CARD_FACES,
  FACE_SCORE,
  FaceValues,
  SUITS_COUNT,
  SUIT_LIST,
} from "../constants/cards.ts";
import { Card, Hand, HandRules, RawCard } from "../types/card.ts";
import { Player } from "../types/players.ts";

export function getHandRules(player: Player): HandRules {
  const { activeHandId, hands, money, firstBet } = player;
  const currentHand = hands[activeHandId];

  if (!currentHand) {
    return { canAfford: false, canSplit: false, isFirstPlay: false };
  }

  const { cards } = currentHand;

  const canAfford = money >= firstBet;
  const isFirstPlay = cards.length === 2;
  const hasMatch = getCardScore(cards[0]) === getCardScore(cards[1]);
  const canSplit = isFirstPlay && hasMatch;

  return { canAfford, canSplit, isFirstPlay };
}

export function getCardScore(rawCard: RawCard): number {
  const [faceValue] = rawCard;

  return faceValue === FaceValues.Ace
    ? ACE_SCORE
    : Math.min(faceValue, FACE_SCORE);
}

export function formatCard(rawCard: RawCard): Card {
  const [faceValue, suit] = rawCard;

  return {
    face: CARD_FACES[faceValue] || faceValue,
    score: getCardScore(rawCard), // todo unused here
    suit,
  };
}

export function getHandScore(hand: Hand): number {
  return hand.cards.reduce((score, card) => {
    let cardScore = getCardScore(card);
    if (cardScore === ACE_SCORE && score > FACE_SCORE) {
      cardScore = 1;
    }

    return score + cardScore;
  }, 0);
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
