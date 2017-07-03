// import Vue from 'vue';
import { mapGetters } from 'vuex';

import HandCtrl from './hand-ctrl';
import BetCtrl from './bet-ctrl';
import EndGameCtrl from './end-game-ctrl';


export default {
  props: ['player'],
  template: `
  <section class="ctrl-bar" >
    <template v-if="player" >
      <div class="player-info frame" >
        <h2>{{player.name}}</h2>
        <p>{{tips}}</p>
      </div>

      <bet-ctrl v-if="gameStage === 0" :player="player" ></bet-ctrl>

      <hand-ctrl v-else-if="gameStage === 3" :player="player" ></hand-ctrl>

      <end-game-ctrl v-else-if="gameStage > 4" :player="player" ></end-game-ctrl>

    </template>
  </section>`,

  components: {
    'hand-ctrl': HandCtrl,
    'bet-ctrl': BetCtrl,
    'end-game-ctrl': EndGameCtrl,
  },

  computed: {

    tips() {
      const player = this.player;
      const stage = this.gameStage;
      const out = new Map([
        [0, `Current money: £${player.money}. Min Bet: £${this.minBet}.`],
        [5, '#endGameStats'], // todo required
        // to do = more tips?
      ]);

      return out.has(stage) ? out.get(stage) : '';
    },

    ...mapGetters([
      'gameStage',
      'minBet',
    ]),
  },

  methods: {


    postMessage(stage) {
      const out = new Map([
        [0, 'Please place Your bets'],
        [1, 'All bets are in, dealing out the first cards.'],
        [5, '#EndGameMessage'], // todo required
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
