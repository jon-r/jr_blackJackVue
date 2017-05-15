import Vue from 'vue';
import PlayerBase from './players/players';
// import gamePlay from './game-data';
import Deck from './deck';

const app = new Vue({
  el: '#v-blackJack',
  components: {
    'player-base': PlayerBase,
  },

  data: {
    config: {
      playerInput: [
        { label: 'Player 1', name: 'Aaron' },
        { label: 'Player 2', name: 'Beth' },
        { label: 'Player 3', name: 'Chris' },
        { label: 'Player 4', name: 'Denise' },
        { label: 'Player 5', name: 'Ethan' },
      ],
      deckInput: 6,
    },
    game: {
      activePlayer: 0,
      roundStage: 0,
      deck: [],
      players: [],
    },
  },
  methods: {
    newGame() {
      const config = this.config;
      const game = this.game;

      game.deck = new Deck(config.deckInput);

      game.players = config.playerInput
        .concat([{ label: 'Dealer', name: 'Dealer' }]);
    },
    nextPlayer() {
      const game = this.game;

      game.activePlayer += 1;

      if (game.activePlayer === game.players.length) {
        return this.nextRoundStage();
      }

      return true;
    },
    nextRoundStage() {
      const game = this.game;
      const roundHooks = [
        'place bids',
        'deal first card',
        'deal second card',
        'player turns',
        'end round',
      ];

      game.activePlayer = 0;
      game.roundStage += 1;

      console.log(roundHooks[game.roundStage]);
    },
  },
});

// just here to skip the 'unused' error
export default app;
