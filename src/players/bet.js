import { mapGetters } from 'vuex';


// TODO: set bids at chips instead of numbers
export default {
  props: ['turn', 'player'],
  template: `
  <div >

    <div class="player-bet" v-show="bet > 0" >
      Bet: £{{bet}}
      <ul class="chip-stack" v-if="activeChips" >
        <li v-for="chip in activeChips" :class="'chip-' + chip" >
          <svg class="token" viewBox="0 0 100 100" >
            <use xlink:href="#chip-tilt"/>
          </svg>
        </li>
      </ul>
    </div>
  </div>
  `,
  components: {},
  data() {
    return {
      bet: 0,
      betStart: 500,
      chipsStart: [],
      activeChips: [],
    };
  },
  computed: {

    willAct() {
      return this.turn && this.betFn;
    },

    firstAct() {
      return this.turn && this.firstBetFn;
    },

    ...mapGetters([
      'gameRound',
      'gameStage',
      'firstBetFn',
      'betFn',
    ]),
  },
  methods: {
    setBaseBet() {
      const money = this.player.money;
      this.betStart = (money < this.minBid) ? 0 : Math.max(this.minBid, Math.ceil(money / 2));
    },

    setFirstBet(values) {
      if (!this.firstAct) return false;

      const { bet, chips } = values;

      this.betStart = bet;
      this.chipsStart = chips;

      this.adjustBet('addBet');

      return true;
    },

    changeExistingBet(bidEvent) {
      const hasEnded = (this.bet === 0 && bidEvent !== 'addBet');

      if (this.willAct && !hasEnded) this.adjustBet(bidEvent);
    },

    addChips() {
      const chips = this.activeChips;
      this.chipsStart.forEach(chip => chips.push(chip));
      this.activeChips = chips.sort((a, b) => a - b);
    },

    adjustBet(bidEvent) {
      console.log(bidEvent);

      if (bidEvent === 'addBet') this.addChips();

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

      if (scoring.end) this.cashIn();

      return this;
    },

    cashIn() {
      this.activeChips = [];
      this.updateMonies({ money: this.bet, bet: -this.bet });
      if (this.player.money < this.minBid) {
        this.$store.dispatch('playerEndGame', this.player);
      }
    },

    updateMonies({ money, bet }) {
      const player = this.player;
      this.$store.dispatch('playerUpdateMoney', { player, money, bet });

      this.bet += bet;
      return this;
    },

  },
  watch: {
    gameRound: 'setBaseBet',
    firstBetFn: 'setFirstBet',
    betFn: 'changeExistingBet',
  },
};
