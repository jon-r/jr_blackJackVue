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

      <bet-ctrl v-if="canBet" :player="player" ></bet-ctrl>

    </template>
  </section>`,
  components: {
    'hand-ctrl': HandCtrl,
    'bet-ctrl': BetCtrl,
  },

  computed: {

    canBet() {
      return (this.gameStage === 0);
    },

    canCtrl() {
      return (this.gameStage === 3);
    },

    tips() {
      const player = this.player;
      const stage = this.gameStage;
      const out = new Map([
        [0, `Current money: £${player.money}. Min Bet: £${this.minBet}.`],
        // to do = more tips?
      ]);

      return out.has(stage) ? out.get(stage) : '';
    },


    ...mapGetters([
      'gameStage',
      'turn',
      'minBet',
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

      const msg = out.get(stage);

      return this.$store.dispatch('setNewMessage', msg);
    },
  },
  watch: {
    gameStage: 'postMessage',
  },
};
