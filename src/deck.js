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
    const cardArr = this.cards.splice(rng, 1)[0];
    // const faceValue = cardArr[0];
    // const suitValue = cardArr[1];
    // const suits = ['diamonds', 'hearts', 'spades', 'clubs'];
    // const faces = {
    //   1: ['A', 11],
    //   11: ['J', 10],
    //   12: ['Q', 10],
    //   13: ['K', 10],
    // };
    // const isfaceCard = cardArr[0] in faces;
    // const card = {
    //   suit: suits[suitValue],
    //   face: isfaceCard ? faces[faceValue][0] : faceValue,
    //   score: isfaceCard ? faces[faceValue][1] : faceValue,
    // };
    console.log(this.cards);
    return cardArr;
  }

}
