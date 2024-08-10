import {Card, RawCard} from "./types/card.ts";

export function getRandom(range: number): number {
  return Math.floor(Math.random() * range);
}

export function buildDeck(decks: number) {
  const cards: RawCard[] = [];
  const nDecks = new Array(decks).fill(0);
  const nSuits = new Array(4).fill(0);
  const nFaces = new Array(13).fill(0);

  nDecks.forEach(() => {
    nSuits.forEach((_y, j) => {
      nFaces.forEach((_z, k) => {
        cards.push([k + 1, j]);
      });
    });
  });
  return cards;
}

export function valueCard(cardRaw: RawCard): Card {
  const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  const faces = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
  const value = cardRaw[0];
  const suit = cardRaw[1];

  return {
    // @ts-expect-error do this better
    face: (value in faces) ? faces[value] : value,
    score: value === 1 ? 11 : Math.min(10, value),
    suit: suits[suit],
  };
}

export const blankCard = { face: '', score: 0, suit: 'blank' };
