import { mapGetters } from 'vuex';

import Vue from 'vue';

import store from './store';

import PlayerFrame from './players/player-frame';
import OptionsForm from './options-form';
import SVGElements from './svg-static';

const app = new Vue({
  el: '#v-blackJack',
  components: {
    'player-frame': PlayerFrame,
    'options-form': OptionsForm,
    'svg-static': SVGElements,
  },

  // VUEX link to store (only need once)
  store,

  computed: {
    debugStage() {
      const stage = this.gameStage;
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

    ...mapGetters([
      'gameStage', // only here for debug purposes atm
      'players',
    ]),
  },

  methods: {},
});

// just here to skip the 'unused' error
export default app;
