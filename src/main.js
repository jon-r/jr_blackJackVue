import { mapGetters } from 'vuex';

import Vue from 'vue';

import store from './store/store';

import PlayerFrame from './players/player-frame';
import CtrlFrame from './ctrls/ctrl-frame';
import SVGElements from './svg-static';
import OptionsModal from './ctrls/options-ctrl';

const app = new Vue({
  el: '#v-blackJack',
  components: {
    'player-frame': PlayerFrame,
    'ctrl-frame': CtrlFrame,
    'svg-static': SVGElements,
    'options-modal': OptionsModal,
  },

  data: {
    showOptions: true,
  },

  // VUEX link to store (only need once)
  store,

  mounted() {
    const el = this.$refs.theShoe;

    this.$store.dispatch('setShoePos', {
      x: el.offsetLeft,
      y: el.offsetTop,
    });
  },

  computed: {

    activePlayer() {
      return this.players[this.gameActivePlayer];
    },

    ...mapGetters([
      'players',
      'gameActivePlayer',
    ]),

  },

  methods: {},
});

// just here to skip the 'unused' error
export default app;
