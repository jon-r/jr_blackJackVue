// TODO: set bids at chips instead of numbers
export default {
  props: ['turn', 'shared', 'wins'],
  template: `
  <div>
    <h5  class="player-money" >
      Money: £{{money}}
      <span :class="diffClass" >£{{moneyDiff}}</span>
    </h5>

    <div v-if="canBid" class="player-bet" >
      <input type="number" v-model.lazy="bidStart"
        :min="minVal" :max="money" />
      <input v-if="validBid" type="button" @click="pushBet" value="Place Bet" />
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
      bidStart: 500,
      money: 1000,
    };
  },
  computed: {
    moneyDiff() {
      const out = this.money - this.oldMoney;
      this.oldMoney = this.money;

      return out;
    },
    diffClass() {
      return this.moneyDiff > 0 ? 'money-plus' : 'money-minus';
    },
    minVal() {
      return Math.min(100, this.money);
    },
    canBid() {
      return (this.shared.stage === 0) && this.turn;
    },
    validBid() {
      return (this.bidStart > this.minVal) && (this.bidStart < this.money);
    },
  },
  methods: {
    pushBet() {
      const bid = this.bidStart;

      this.money -= bid;
      this.bet = bid;

      this.validBid = false;

      this.$emit('end-turn');
    },
    newGameReset() {
      this.oldMoney = 0;
      this.bet = 0;
      this.bidStart = 500;
      this.money = 1000;
    },
  },
  watch: {
    'shared.roundID': 'newGameReset',
  },
};
