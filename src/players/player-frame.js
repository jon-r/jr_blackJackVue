// import Vue from 'vue';
import { mapGetters } from 'vuex';

import PlayerHand from './hand';
import PlayerBet from './bet';

export default {
  props: ['player'],
  template: `
  <section class="player-frame" :class="playerClass" >
    <div class="player-frame-inner" >

      <h3 class="player-name" :class="{active: isPlayerTurn, inactive: isPlayerInactive }" >{{player.name}}</h3>

      <h5 class="player-money" >
        Money: £{{player.money}}
        <span :class="diffClass" >£{{moneyDiff}}</span>
      </h5>

      <player-hand
        v-show="gameStage > 0"
        :player="player"
        :turn="isPlayerTurn" >
      </player-hand>

      <player-bet
        v-show="!player.isDealer"
        :player="player"
        :turn="isPlayerTurn" >
      </player-bet>

    </div>
  </section>`,
  components: {
    'player-hand': PlayerHand,
    'player-bet': PlayerBet,
  },
  data() {
    return {
      playerClass: `player-${this.player.index}`,
      skip: false,
      oldMoney: 0,
    };
  },

  computed: {

    diffClass() {
      return (this.moneyDiff > 0) ? 'money-plus' : 'money-minus';
    },

    moneyDiff() {
      const out = this.player.money - this.oldMoney;
      this.oldMoney = this.player.money;
      return out;
    },

    isPlayerTurn() {
      return this.gameActivePlayer === this.player.index;
    },

    isPlayerInactive() {
      return !this.player.inGame;
    },

    ...mapGetters([
      'gameActivePlayer',
      'dealer',
      'gameStage',
      'minBid',
    ]),
  },

  methods: {

    // TODO:
    // fix the skipping of players when out of money.

    turnCheck() {
      const cantBid = !this.player.inGame;
      const wontBid = this.gameStage === 0 && this.player.isDealer;

      if (this.isPlayerTurn && (cantBid || wontBid)) {
        this.$store.dispatch('nextPlayer');
      }
    },

    endRound() {
      const dealerScore = this.dealer.score;
      if (dealerScore === 0) return false;

      const result = this.getScores(dealerScore);

      return this.emitBidChange(result);
    },

    emitBidChange(params) {
      const values = {
        target: this.player.index,
        type: 'bid',
        params,
      };

      return this.$store.dispatch('fireEventBus', values);
    },

    getScores(dealerScore) {
      const playerScore = this.player.score;
      switch (true) {
      case dealerScore === playerScore:
        return 'push';
      case playerScore > 21 || dealerScore === 21:
        return 'lose';
      case dealerScore > 21 || playerScore > dealerScore:
        return 'win';
      default: // dealerScore > playerScore
        return 'lose';
      }
    },
  },
  watch: {
    'dealer.score': 'endRound',
    isPlayerTurn: 'turnCheck',
  },
};
