// import Vue from 'vue';
import { mapGetters } from 'vuex';

import HandCtrl from './hand-ctrl';
import BetCtrl from './bet-ctrl';


export default {
  props: ['player'],
  template: `
  <section class="ctrl-bar" >
    <template v-if="player" >

      <div class="player-info frame" v-html="infoText" >
      </div>

      <hand-ctrl v-if="canCtrl" :player="player" ></hand-ctrl>

      <bet-ctrl v-if="canBid" :player="player" ></bet-ctrl>

    </template>

    <sub class="debugger">*debug* Stage: {{gameStage}} - {{debugStage}}</sub>

  </section>`,
  components: {
    'hand-ctrl': HandCtrl,
    'bet-ctrl': BetCtrl,
  },


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

    infoText() {
      const stage = this.gameStage;
      const player = this.player;
      const out = new Map([
        [0, `<h4>${player.name}, place your bets. </h4> <p>Current money: £${player.money}. Min Bid: £${this.minBid}</p>`],
        [1, 'Dealing out the first cards.'],
        [2, 'Dealing out the first cards. #peekCheck'],
        [3, `${player.name}'s turn. #drawnResponse`],
        [4, '#scoresResponse'],
      ]);
      return out.has(stage) ? out.get(stage) : '';
    },

    canBid() {
      return (this.gameStage === 0);
    },

    canCtrl() {
      return (this.gameStage === 3);
    },

    ...mapGetters([
      'dealer',
      'gameStage',
      'minBid',
    ]),
  },

  methods: {

  },
  watch: {

  },
};
