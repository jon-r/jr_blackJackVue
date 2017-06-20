import { mapGetters } from 'vuex';


// TODO: set bids at chips instead of numbers
export default {
  props: ['turn', 'player'],
  template: `
  <div class="player-bet" v-show="bet > 0" >
    Bet: £{{bet}}
    <ul class="chip-stack stack-right" v-if="activeChips" >
      <li v-for="chip in activeChips" :class="'chip-' + chip" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" >
          <use class="token" xlink:href="#chip-tilt"/>
        </svg>
      </li>
    </ul>
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

    isBidEvent() {
      const evt = this.eventBus;
      return evt.targetPlayer === this.player.index && evt.eventType === 'bid' && evt.eventParams;
    },

    ...mapGetters([
      'gameRound',
      'eventBus',
      'minBid',
    ]),
  },
  methods: {
    setBaseBet() {
      const money = this.player.money;
      this.betStart = (money < this.minBid) ? 0 : Math.max(this.minBid, Math.ceil(money / 2));
    },

    setBet(params) {
      if (!this.isBidEvent) return false;

      const bidFn = params.firstBid ? this.setFirstBet : this.adjustBet;

      return bidFn(params);
    },

    setFirstBet(values) {
      const { bet, chips } = values;

      this.betStart = bet;
      this.chipsStart = chips;

      this.adjustBet('addBet', true);

      return true;
    },

    addChips() {
      const chips = this.activeChips;
      this.chipsStart.forEach(chip => chips.push(chip));
      this.activeChips = chips.sort((a, b) => a - b);
    },

    adjustBet(bidEvent, firstBet = false) {
      if (this.bet === 0 && !firstBet) return this;

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

      console.log(this.player.money, this.player.name);

      if (this.player.money < this.minBid) {
        console.log(this.player.name, 'game over')
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
    'eventBus.eventParams': 'setBet',
  },
};
