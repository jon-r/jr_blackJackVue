import gamePlay from '../game-data';

// TODO: set bids at chips instead of numbers
export default {
  props: ['turn'],
  template: `
  <div>
    <h5  class="player-money" >
      Money: £{{money}}
      <span :class="diffClass" >£{{moneyDiff}}</span>
    </h5>

    <div v-if="canBid && !hasBid" class="player-bet" >
      <input type="number" v-model.lazy="bidStart"
        :min="minVal" :max="money" />
      <input type="button" @click="pushBet" value="Place Bet" />
    </div>
    <span>{{errorStr}}</span>
    <h4 class="player-bet" v-if="bet > 0" >
      Bet: £{{bet}}
    </h4>
  </div>
  `,
  data() {
    return {
      shared: gamePlay.state,
      oldMoney: 0,
      errorStr: '',
      bet: 0,
      bidStart: 500,
      money: 1000,
      hasBid: false,
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
      return (this.shared.roundStage === 0) && this.turn;
    },
  },
  methods: {
    pushBet() {
      const bid = this.bidStart;

      if (bid < this.minVal) {
        this.errorStr = 'Bid too low';
        return false;
      }
      if (bid > this.money) {
        this.errorStr = 'Bid too high';
        return false;
      }

      this.errorStr = '';
      this.money -= bid;
      this.bet = bid;
      this.hasBid = true;
      gamePlay.nextPlayer();

      // this.$emit('pushBet');
      return true;
    },
  },
};
