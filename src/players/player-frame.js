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
      @end-turn="endTurn"
      v-model="player.score" >
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
        // may clash with 'win'
        blackJack: { cost: 0, wins: 2.5 },
        lose: { cost: 0, wins: 0 },
        push: { cost: 0, wins: 1 },
        win: { cost: 0, wins: 2 },
      };

      if (this.shared.dealerScore === 21) {
        multipliers.blackJack = multipliers.push;
        // Todo: insta wins/losses ??
      }

      const scoring = multipliers[value];
      this.cost = scoring.cost * bet;
      this.bet *= scoring.wins;
      console.log(`${value} cost: ${this.cost}, bet: ${this.bet}`);
      this.$nextTick(() => { this.cost = 0; });
    },
    endRound() {
      const dealerScore = this.shared.dealerScore;
      if (dealerScore === 0) return false;

      if (this.bet === 0) return false; // already bust/forfeit

      const playerScore = this.player.score;
      if (dealerScore === playerScore) {
        this.updateBid('push');
      } else if (playerScore > 21 || dealerScore === 21) {
        this.updateBid('lose');
      } else if (dealerScore > 21 || playerScore > dealerScore) {
        this.updateBid('win');
      } else if (dealerScore > playerScore) {
        this.updateBid('lose');
      }

      return true; // Todo: give winnings back to player
    },
  },
  watch: {
    'shared.dealerScore': 'endRound',
  },
};
