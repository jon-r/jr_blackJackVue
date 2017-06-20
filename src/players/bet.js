import { mapGetters } from 'vuex';
import { runLerpLoop, setStartFinish, setTarget } from '../animationTools';

// TODO: set bids at chips instead of numbers
export default {
  props: ['turn', 'player', 'framepos'],
  template: `
  <div class="player-bet" v-show="bet > 0" >
    Bet: £{{bet}}
    <transition-group class="chip-stack stack-right" name="bets" tag="ul"
      @before-enter="beforeEnter" @enter="enter" @leave="leave" >
      <li v-for="(chip, idx) in activeChips"
        :class="'chip-' + chip"
        :key="idx"
        :data-key="idx" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" >
          <use class="token" xlink:href="#chip-tilt"/>
        </svg>
      </li>
    </transition-group>
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

    leavePosition() {
      const frame = this.framepos;
      return {
        x: -frame.x,
        y: -frame.y,
      };
    },

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

    beforeEnter(el) {
      const start = { x: 0, y: 200, r: 0 };

//      el.style.opacity = 0;
      setStartFinish(el, { start });
    },
    enter(el, done) {
//      el.style.opacity = 1;
      runLerpLoop(el, done);
    },
    leave(el, done) {
      setTarget(el, this.leavePosition);
      runLerpLoop(el, done);
    },

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
    'eventBus.eventParams': 'setBet',
  },
};
