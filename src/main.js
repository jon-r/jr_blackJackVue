import { mapGetters } from 'vuex';

import Vue from 'vue';

import Store from './store';

// import game from './game-play';
import PlayerFrame from './players/player-frame';
import OptionsForm from './options-form';
import Deck from './deck';

const app = new Vue({
  el: '#v-blackJack',
  components: {
    'player-frame': PlayerFrame,
    'options-form': OptionsForm,
  },
  data: {

    shared: {
      roundID: 0,
      stage: 0,
      activePlayer: 0,
      dealerScore: 0,
      deck: [],
    },

    players: [],
  },

  // VUEX link to store (only need once)
  store: Store,

  computed: {

    // VUEX get value. look into mapGetters to do multiple??
    gameStage() {
      return this.$store.getters.gameStage;
    },

    debugStage() {
      const stage = this.shared.stage;
      const out = new Map([
        [0, 'bid'],
        [1, 'dealing cards 1'],
        [2, 'dealing cards 2'],
        [3, 'player turns'],
        [4, 'filling blanks'],
        [5, 'player scores'],
      ]);

      return out.has(stage) ? out.get(stage) : 'no stage';
    },
  },

  methods: {

    newGame(config, skipBets = false) {
      const newRoundID = this.shared.roundID + 1;

      this.players = config.players;

      this.shared = {
        roundID: newRoundID,
        activePlayer: 0,
        dealerScore: 0,
        stage: 0,
        deck: new Deck(config.deckCount),
      };

      if (skipBets) {
        this.shared.activePlayer = 10;
        this.$nextTick(() => {
          this.endStage();
        });
      }
    },
    endTurn() {
      const shared = this.shared;
      shared.activePlayer += 1;

      if (shared.stage === 0 && this.players[shared.activePlayer].isDealer) {
        return this.endStage();
      }

      if (shared.activePlayer > this.players.length - 1) {
        return this.endStage();
      }

      return shared.activePlayer;
    },

    endStage() {
      const shared = this.shared;

      shared.activePlayer = 0;
      shared.stage += 1;

      // VUEX do action
      this.$store.dispatch('nextStage');

      if (shared.stage > 5) this.endRound();
    },

    endRound() {
      this.shared.dealerScore = this.players.slice(-1)[0].score;
      this.$nextTick(() => {
        this.shared.dealerScore = 0;
      });
    },
  },
});

// just here to skip the 'unused' error
export default app;
