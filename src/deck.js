import { getRandom } from './utils';


/**
 * Builds a deck of cards for the dealer to use.
 * Iterates through n = [this.count] decks, 4 suits and 14 cards per suit.
 */
function build(decks) {
  const cards = [];
  const nDeck = new Array(decks).fill();
  const nSuits = new Array(4).fill();
  const nFaces = new Array(13).fill();

  nDeck.forEach((x, i) => {
    nSuits.forEach((y, j) => {
      nFaces.forEach((z, k) => {
        cards.push([k + 1, j]);
      });
    });
  });

  return cards;
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
    return this.cards.splice(rng, 1)[0];
  }

}
