import {
  ACE_SCORE,
  CARD_FACES,
  FACE_SCORE,
  FaceValues,
} from "../constants/cards.ts";
import { Card, HandRules, RawCard } from "../types/card.ts";
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
  const hasPair = cards[0][0] === cards[1][0];
  const canSplit = isFirstPlay && hasPair;

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
