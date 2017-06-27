// import Vue from 'vue';
import { mapGetters } from 'vuex';

import HandCtrl from './hand-ctrl';
import BetCtrl from './bet-ctrl';


export default {
  props: ['player'],
  template: `
  <section class="ctrl-bar" >
    <template v-if="player" >
      <div class="player-info frame" >
        <h2>{{player.name}}</h2>
        <p>{{tips}}</p>
      </div>

      <hand-ctrl v-if="canCtrl" :player="player" ></hand-ctrl>

      <bet-ctrl v-if="canBid" :player="player" ></bet-ctrl>

    </template>
  </section>`,
  components: {
    'hand-ctrl': HandCtrl,
    'bet-ctrl': BetCtrl,
  },

  computed: {

    canBid() {
      return (this.gameStage === 0);
    },

    canCtrl() {
      return (this.gameStage === 3);
    },

    tips() {
      const player = this.player;
      const stage = this.gameStage;
      const out = new Map([
        [0, `Current money: £${player.money}. Min Bid: £${this.minBid}.`],
        // to do = more tips?
      ]);

      return out.has(stage) ? out.get(stage) : '';
    },


    ...mapGetters([
      'gameStage',
      'turn',
      'minBid',
      'handRules',
    ]),
  },

  methods: {


    postMessage(stage) {
      const out = new Map([
        [0, 'Please place Your bets'],
        [1, 'All bets are in, dealing out the first cards.'],
      ]);

      if (!out.has(stage)) return false;

      const msgValues = {
        type: 'message',
        params: out.get(stage),
      };

      return this.$store.dispatch('fireEventBus', msgValues);
    },
  },
  watch: {
    gameStage: 'postMessage',
  },
};
