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
    messages: [],
    messageIdx: 0,
  },

  // VUEX link to store
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
      'newMessage',
    ]),

  },

  methods: {
    updateChat(params) {
      const maxMessages = 5;

      this.messageIdx += 1;

      this.messages.unshift({
        text: params,
        idx: this.messageIdx,
      });

      if (this.messages.length > maxMessages) this.messages.pop();
    },
  },

  watch: {
    newMessage: 'updateChat',
  },
});

// just here to skip the 'unused' error
export default app;
