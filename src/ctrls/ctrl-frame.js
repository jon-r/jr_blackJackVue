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
        <h3>Player: {{player.name}}</h3>
        <p>Current Money: £{{player.money}}.<br>
        {{infoText}}
        </p>
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
      const name = this.player.name;
      const out = new Map([
        [0, `${name}, place your bets.`],
        [1, 'Dealing out the first cards.'],
        [2, 'Dealing out the first cards. #peekCheck'],
        [3, `${name}'s turn. #drawnResponse`],
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
    ]),
  },

  methods: {

  },
  watch: {

  },
};
