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

    <h4 class="player-bet" v-show="bet > 0" >
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
    diffClass() {
      return (this.moneyDiff > 0) ? 'money-plus' : 'money-minus';
    },

    moneyDiff() {
      const out = this.player.money - this.oldMoney;
      this.oldMoney = this.player.money;
      return out;
    },

    minVal() {
      return Math.min(this.minBid, this.player.money);
    },
    canBid() {
      return (this.gameStage === 0) && this.turn;
    },
    validBet() {
      return (this.betStart > this.minVal) && (this.betStart <= this.player.money);
    },

    ...mapGetters([
      'gameRound',
      'gameStage',
      'minBid',
    ]),
  },
  methods: {
    setBaseBet() {
      const money = this.player.money;
      this.betStart = (money < this.minBid) ? 0 : Math.max(this.minBid, this.player.money / 2);
    },

    setFirstBet() {
      this.validBid = false;
      this.adjustBet('addBet');
      this.$store.dispatch('nextPlayer');
    },
    adjustBet(bidEvent) {
      const hasEnded = (this.bet === 0 && bidEvent !== 'addBet');
      if (!bidEvent || hasEnded) return this;

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

      const money = betStart * scoring.cost;
      const bet = betStart * scoring.wins;

      this.updateMonies({ money, bet });

      this.$nextTick(() => {
        if (scoring.end) this.cashIn();
      });
      return this;
    },

    cashIn() {
      this.updateMonies({ money: this.bet, bet: -this.bet });
    },

    updateMonies({ money, bet }) {
      const player = this.player;
      this.$store.dispatch('playerUpdateMoney', { player, money });

      this.bet += bet;
      return this;
    },

  },
  watch: {
    'player.bidEvent': 'adjustBet',
    gameRound: 'setBaseBet',
  },
};
