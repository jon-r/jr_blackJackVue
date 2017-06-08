import { mapGetters } from 'vuex';

// TODO: set bids at chips instead of numbers
export default {
  props: ['turn', 'player'],
  template: `
  <div class="player-money" >
    <h5>
      Money: £{{player.money}}
      <span :class="diffClass" >£{{moneyDiff}}</span>
    </h5>

    <div v-if="canBid" class="player-bet" >
      <input type="number" v-model.lazy="betStart"
        :min="minVal" :max="player.money" />
      <input v-if="validBet" type="button" @click="setFirstBet" value="Place Bet" />
    </div>

    <h4 class="player-bet" v-if="bet > 0" >
      Bet: £{{bet}}
    </h4>
  </div>
  `,
  data() {
    return {
      oldMoney: 0,
      bet: 0,
      betStart: 500,
    };
  },
  computed: {
    ...mapGetters([
      'gameRound',
      'gameStage',
      'dealerScore',
    ]),

    diffClass() {
      return (this.moneyDiff > 0) ? 'money-plus' : 'money-minus';
    },

    moneyDiff() {
      const out = this.player.money - this.oldMoney;
      this.oldMoney = this.player.money;
      return out;
    },

    minVal() {
      return Math.min(100, this.player.money);
    },
    canBid() {
      return (this.gameStage === 0) && this.turn;
    },
    validBet() {
      return (this.betStart > this.minVal) && (this.betStart < this.player.money);
    },
  },
  methods: {
    setFirstBet() {
      this.validBid = false;
      this.adjustBet('addBet').emitEndTurn();
    },
    adjustBet(bidEvent) {
      if (!bidEvent) return this;

      const betStart = this.betStart;
      const multipliers = {
        // Todo: better split results
        addBet: { cost: -1, wins: 1, end: false },
        forfeit: { cost: 0.5, wins: -1, end: true },
        lose: { cost: 0, wins: -1, end: true },
        push: { cost: 0, wins: 0, end: true },
        win: { cost: 0, wins: 1, end: true },
        blackJack: { cost: 0, wins: 1.5, end: true },
      };

      const scoring = multipliers[bidEvent];

      console.log(scoring, bidEvent);

      const money = betStart * scoring.cost;
      const bet = betStart * scoring.wins;

      this.updateMonies({ money, bet });

      this.$nextTick(() => {
        if (scoring.end) this.cashIn();
      });
      return this;
    },

    cashIn() {
      this.updateMonies({ money: this.bet, bet: -this.bet }).emitEndTurn();
    },

    updateMonies({ money, bet }) {
      const player = this.player;
      this.$store.dispatch('playerUpdateMoney', { player, money });

      this.bet += bet;
      return this;
    },


    emitEndTurn() {
      this.$store.dispatch('playerEndTurn');
    },

  },
  watch: {
    'player.bidEvent': 'adjustBet',
  },
};
