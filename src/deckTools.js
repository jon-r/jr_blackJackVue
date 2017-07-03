export function getRandom(range) {
  return Math.floor(Math.random() * range);
}

export function buildDeck(decks) {
  const cards = [];
  const nDecks = new Array(decks).fill();
  const nSuits = new Array(4).fill();
  const nFaces = new Array(13).fill();

  nDecks.forEach((x, i) => {
    nSuits.forEach((y, j) => {
      nFaces.forEach((z, k) => {
        cards.push([k + 1, j]);
      });
    });
  });
  return cards;
}

export function valueCard(cardRaw) {
  const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  const faces = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
  const value = cardRaw[0];
  const suit = cardRaw[1];

  return {
    face: (value in faces) ? faces[value] : value,
    score: value === 1 ? 11 : Math.min(10, value),
    suit: suits[suit],
  };
}

export const blankCard = { face: '', score: 0, suit: 'blank' };
