// import Vue from 'vue';
import { mapGetters } from 'vuex';

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
      @bid-change="setWins"
      @end-turn="emitEndTurn"
      v-model="player.score" >
    </player-hand>

    <template v-if="!player.isDealer" >
      <player-bet
        :shared="shared"
        :turn="isPlayerTurn"
        :cost="cost"
        @push-bet="setFirstBet" >
      </player-bet>

      <h4 class="player-bet" v-if="bet > 0" >
        Bet: £{{wins}}
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
      skip: false,
    };
  },

  computed: {
    ...mapGetters([
      'gameActivePlayer',
    ]),

    isPlayerTurn() {
      return this.gameActivePlayer === this.player.index;
    },
  },

  methods: {
    emitEndTurn() {
      this.$emit('end-turn');
    },
    setFirstBet(bet) {
      this.bet = bet;
      this.wins = bet;
      this.emitEndTurn();
    },
    setWins(value) {
      const bet = this.bet;
      const multipliers = {
        // Todo: better split results
        doubleBet: { cost: -1, wins: 1, end: false },
        forfeit: { cost: 0.5, wins: -1, end: true },
        lose: { cost: 0, wins: -1, end: true },
        push: { cost: 0, wins: 0, end: true },
        win: { cost: 0, wins: 1, end: true },
        blackJack: { cost: 0, wins: 1.5, end: true },
      };

      if (this.shared.dealerScore === 21) {
        multipliers.blackJack = multipliers.push;
      }

      const scoring = multipliers[value];
      this.cost = scoring.cost * bet;
      this.wins += scoring.wins * bet;
      console.log(`${value} cost: ${this.cost}, wins: ${this.wins}`);
      this.$nextTick(() => {
        if (scoring.end) {
          this.cashIn();
        } else {
          this.cost = 0;
        }
      });
    },
    endRound() {
      const dealerScore = this.shared.dealerScore;
      if (dealerScore === 0 || this.wins === 0) return false;

      const result = this.getScores(this.player.score, dealerScore);

      this.setWins(result);

      return true;
    },
    getScores(playerScore, dealerScore) {
      if (dealerScore === playerScore) {
        return 'push';
      }
      if (playerScore > 21 || dealerScore === 21) {
        return 'lose';
      }
      if (dealerScore > 21 || playerScore > dealerScore) {
        return 'win';
      }
  //    if (dealerScore > playerScore) {
      return 'lose';
    },
    cashIn() {
      this.cost = this.wins;
      this.$nextTick(() => {
        this.cost = 0;
        this.wins = 0;
        this.bet = 0;
        this.skip = true;
        this.emitEndTurn();
      });
    },
  },
  watch: {
    'shared.dealerScore': 'endRound',
  },
};
