import Vue from 'vue';

import game from './game-play';
import PlayerFrame from './players/player-frame';
import OptionsForm from './options-form';
// import Deck from './deck';

const app = new Vue({
  el: '#v-blackJack',
  components: {
    'player-frame': PlayerFrame,
    'options-form': OptionsForm,
  },
  data: {
    game,
  },
  computed: {
    players() {
      return this.game.players;
    },
  },
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
});

// just here to skip the 'unused' error
export { app };
