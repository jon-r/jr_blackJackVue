import Vue from 'vue';
import Deck from './deck';

export default {

  defaults: {
    playerInput: [
      { label: 'Player 1', name: 'Aaron' },
      { label: 'Player 2', name: 'Beth' },
      { label: 'Player 3', name: 'Chris' },
      { label: 'Player 4', name: 'Denise' },
      { label: 'Player 5', name: 'Ethan' },
    ],
    deckInput: 6,
  },

  state: {
    roundID: 0,
    stage: 0,
    turn: 0,
  },
  deck: {},
  players: [],
  dealerID: 0,

  newGame(config) {
    const newRoundID = this.state.roundID + 1;

    this.players = config.players;
    this.dealerID = config.players.length - 1;
    this.deck = new Deck(config.deckCount);
    this.state = {
      roundID: newRoundID,
      turn: 0,
      stage: 0,
    };
  },

  endTurn() {


    this.state.turn += 1;

    const gameState = this.state;

    if (gameState.stage === 0 && gameState.turn === this.dealerID) {
      return this.endStage();
    }


    if (gameState.turn === this.players.length) {
      return this.endStage();
    }

    return true;
  },

  endStage() {

    console.log('new stage');

    const gameState = this.state;
    const roundHooks = [
      'place bids',
      'deal first card',
      'deal second card',
      'player turns',
      'end round',
    ];

    gameState.turn = 0;
    gameState.stage += 1;

    console.log(roundHooks[gameState.stage]);
  },

};


//  watch: {
//    players() {
//      return gamePlay.players;
//    }
//  },
//  methods: {
//    setOptions(config) {
//      return this.game.newGame(config);
//    },
//    nextPlayer() {
//      const game = this.game;
//
//      game.activePlayer += 1;
//      if (game.roundStage === 0 && game.activePlayer === game.dealerID) {
//        return this.nextPlayer();
//      }
//
//      if (game.activePlayer === this.players.length) {
//        return this.nextRoundStage();
//      }
//
//      return true;
//    },
//    nextRoundStage() {
//      const game = this.game;
//      const roundHooks = [
//        'place bids',
//        'deal first card',
//        'deal second card',
//        'player turns',
//        'end round',
//      ];
//
//      game.activePlayer = 0;
//      game.roundStage += 1;
//
//      console.log(roundHooks[game.roundStage]);
//    },
//    skipBets() {
//      this.newGame();
//      this.nextPlayer();
//      Vue.nextTick(() => this.nextRoundStage());
//    },
//  },

