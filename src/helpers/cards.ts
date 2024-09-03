import {
  CARDS_PER_SUIT,
  CARD_VALUES,
  FaceValues,
  SUITS_COUNT,
  SUIT_LIST,
} from "../constants/cards.ts";
import { HandRules, PlayingCard } from "../types/card.ts";
import { Player } from "../types/players.ts";

export function getHandRules(player: Player): HandRules {
  const { activeHandId, hands, money, openBet } = player;
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
  const canAfford = money >= openBet;
  const hasMatchingCards = getCardScore(cards[0]) === getCardScore(cards[1]);

  return {
    canSurrender: isFirstPlay,
    canDouble: isFirstPlay && canAfford,
    canSplit: isFirstPlay && canAfford && hasMatchingCards,
  };
}

export function getCardScore(rawCard: PlayingCard): number {
  const [faceValue] = rawCard;

  return CARD_VALUES[faceValue] || faceValue;
}

export function isBlankCard([faceValue]: PlayingCard) {
  return faceValue === FaceValues.Blank;
}

export function isAce([faceValue]: PlayingCard) {
  return faceValue === FaceValues.Ace;
}

export function buildDeck(decks: number): PlayingCard[] {
  const cards: PlayingCard[] = [];
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
