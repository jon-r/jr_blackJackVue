import Deck from './deck';

export default {

  debug: true,
  state: {
    activePlayer: 0,
    deck: [],
    players: [],
    roundStage: 0,
  },

/*
Round stages:
0 = bidding
1 = dealing hand1
2 = dealing hand2
2 = player turns
3 = round over, geting scors
*/

  newGame(config) {
    const deckCount = config.deckInput;
    const data = this.state;
    const players = [{ id: 0, label: 'Dealer', name: 'Dealer' }];

    data.deck = new Deck(deckCount);
    data.roundStage = 1;

    data.players = players.concat(config.playerInput);
  },

  nextRoundStage() {
    const data = this.state;
    const roundHooks = [
      this.placeBids,
      this.dealCards1,
      this.dealCards2,
      this.playerTurn,
      this.completeRound,
    ];

    data.activePlayer = 0;
    data.roundStage += 1;

    return roundHooks[data.roundStage]();
  },

  nextPlayer() {
    const data = this.state;
    const count = data.players.length;
    const active = data.activePlayer + 1;


    if (active === count - 1) {
      return this.nextRoundStage();
    }

    data.activePlayer = active;

    return true;
  },

  placeBids() {
    console.log('bids turn');
  },

  dealCards1() {
    console.log('first dealt cards');
  },

  dealCards2() {
    console.log('second cards');
  },

  playerTurn() {
    console.log('player turns');
  },

  completeRound() {
    console.log('round over. taking scores');
  },


    // setState(key, newValue) {
    //   this.debug && console.log('setState', `${key} => ${newValue}`);
    //   this.state[key] = newValue;
    // },
    // clearState(key) {
    //   this.debug && console.log('clearState triggered', `${key} => reset`);
    //   this.state[key] = '';
    // },
};
