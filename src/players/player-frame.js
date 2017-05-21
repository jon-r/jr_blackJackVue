// import Vue from 'vue';

import PlayerHand from './player-hand';
import PlayerBet from './player-bet';

export default {
  props: ['shared', 'player'],
  template: `
  <section class="player-frame" :class="playerClass" >

    <h3 class="player-name" :class="{active: isPlayerTurn}" >{{player.name}}</h3>

    <player-hand
      :player="player"
      :shared="shared"
      :turn="isPlayerTurn"
      @bid-change="updateBid"
      @end-turn="endTurn" >
    </player-hand>

    <template v-if="!player.isDealer" >
      <player-bet      
        :shared="shared"
        :turn="isPlayerTurn"
        :cost="cost"
        @push-bet="setBid" >
      </player-bet>

      <h4 class="player-bet" v-if="bet > 0" >
        Bet: £{{bet}}
      </h4>
    </template>

  </section>`,
  components: {
    'player-hand': PlayerHand,
    'player-bet': PlayerBet,
  },
  data() {
    return {
      playerClass: `player-${this.player.index}`,
      wins: 0,
      bet: 0,
      cost: 0,
    };
  },

  computed: {
    isPlayerTurn() {
      return this.shared.activePlayer === this.player.index;
    },
  },

  methods: {
    endTurn() {
      this.$emit('end-turn');
    },
    setBid(bet) {
      this.bet = bet;
      this.endTurn();
    },
    updateBid(value) {
      const bet = this.bet;
      const multipliers = {
        double: { cost: -1, wins: 2 },
        split: { cost: -1, wins: 2 },
        forfeit: { cost: 0.5, wins: 0 },
        blackJack: { cost: 0, wins: 2.5 },
        lose: { cost: 0, wins: 0 },
        push: { cost: 0, wins: 1 },
        win: { cost: 0, wins: 2 },
      };

      const scoring = multipliers[value];
      this.cost = scoring.cost * bet;
      this.bet *= scoring.wins;
      console.log(`cost: ${this.cost}, bet: ${this.bet}`);
      this.$nextTick(() => { this.cost = 0; });
    },
  },
};
