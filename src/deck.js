/**
 * Builds a deck of cards for the dealer to use.
 * Iterates through n = [this.count] decks, 4 suits and 14 cards per suit.
 */
function build(decks) {
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

function getRandom(range) {
  return Math.floor(Math.random() * range);
}

function faceCards(cardValue) {
  const faces = {
    1: 'A',
    11: 'J',
    12: 'Q',
    13: 'K',
  };
  return (cardValue in faces) ? faces[cardValue] : cardValue;
}

function suitCards(cardSuit) {
  const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  return suits[cardSuit];
}

function faceValue(cardValue) {
  return cardValue === 1 ? 11 : Math.min(10, cardValue);
}


/** class Deck represents the deck of cards */
export default class Deck {
  /**
   * Sets up a new deck oject
   * @param {number} deckCount - number of decks to use
   */
  constructor(deckCount) {
    this.count = deckCount;

    this.cards = build(deckCount);

    this.blank = { face: 'x', score: 0, suit: 'blank' };
  }

  /**
   * rebuilds the deck
   */
  restart() {
    this.cards = build(this.count);
  }

  /**
   * draws a single card at random and gives it a name and score.
   * @returns {Object} card - card with face value and name.
   */
  deal() {
    const rng = getRandom(this.cards.length);
    return this.takeCard(rng);
  }

  peek(toMatch) {
    console.log('dealer checks card');
//    const rng = getRandom(this.cards.length);
    const rng = 0; // TEMP
    const isBlackJack = faceValue(this.cards[rng][0]) + toMatch === 21;
    console.log(isBlackJack, this.cards[rng][0]);

    return isBlackJack ? this.takeCard(rng) : this.dealBlank();
  }

  takeCard(nth) {
    const cardArr = this.cards.splice(nth, 1)[0];

    return {
      face: faceCards(cardArr[0]),
      score: faceValue(cardArr[0]),
      suit: suitCards(cardArr[1]),
    };
  }

  dealBlank() {
    return this.blank;
  }

}
