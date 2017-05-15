// import gamePlay from '../game-data';

// TODO: set bids at chips instead of numbers
export default {
  props: ['game', 'turn'],
  template: `
  <div>
    <h5  class="player-money" >
      Money: £{{money}}
      <span :class="diffClass" >£{{moneyDiff}}</span>
    </h5>

    <div v-if="canBid" class="player-bet" >
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
//      shared: gamePlay.state,
      oldMoney: 0,
      errorStr: '',
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
      return (this.game.roundStage === 0) && this.turn;
    },
    validBid() {
      return (this.bidStart < this.minVal) && (this.bidStart > this.money);
    },
  },
  methods: {
    pushBet() {
      const bid = this.bidStart;

      this.money -= bid;
      this.bet = bid;

      return this.$emit('end-turn');
//      return this.nextPlayer();
    },

  },
};
