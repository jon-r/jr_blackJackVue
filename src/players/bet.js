import { mapGetters } from 'vuex';
import { runLerpLoop, setStartFinish, setTarget, arrayStaggeredPush, arrayStaggeredPull } from '../animationTools';

// TODO: set bids at chips instead of numbers
export default {
  props: ['turn', 'player', 'framepos'],
  template: `
  <div class="player-bet" >
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
//      chipsStart: [],
      activeChips: [],
    };
  },
  computed: {

    leavePosition() {
      const frame = this.framepos;
      return { x: 0, y: -frame.y };
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
      const start = { x: 0, y: -200, r: 0 };

      setStartFinish(el, { start });
    },
    enter(el, done) {
//      el.style.opacity = 1;
      runLerpLoop(el, done, 50);
    },
    leave(el, done) {
      const target = this.leavePosition;
      setTarget(el, target);
      runLerpLoop(el, done, 50);
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
//      this.chipsStart = chips;

      this.adjustBet('addBet', true);

      return true;
    },

    calcChips(value) {
      const chips = [1000, 500, 100, 25, 10, 5];
      const out = [];

      let i = 0;
      let remainder = value;

      while (i < chips.length) {
        const chip = chips[i];
        if (chip <= remainder) {
          out.push(chip);
          remainder -= chip;
        } else {
          i += 1;
        }
      }
      return out;
    },

    adjustChips(newBet) {
      if (newBet === 0) return false;

      const array = this.activeChips;
      const input = this.calcChips(Math.abs(newBet));
      const args = [input, array, 100];

    //  console.log('adjust', this.player.name, input, array);

      switch (true) {
      case (newBet < 0):
        return arrayStaggeredPull(...args);
      case (newBet > 0):
        return arrayStaggeredPush(...args);
      default: // no change
        return false;
      }
    },

    adjustBet(bidEvent, firstBet = false) {
      if (this.bet === 0 && !firstBet) return this;

      const betAdjust = {
        addBet: 1,
        forfeit: -0.5,
        lose: -1,
        push: 0,
        win: 1,
        blackJack: 1.5,
      };

      const betStart = this.betStart;
      const money = (bidEvent === 'addBet') ? -betStart : 0;
      const bet = betStart * betAdjust[bidEvent];

      this.adjustChips(bet);
      this.updateMonies({ money, bet });

      if (bidEvent !== 'addBet') this.cashIn();

      return this;
    },

    cashIn() {
      this.updateMonies({ money: this.bet, bet: -this.bet });

      // TODO: slide chips to/from the player? align stack to bottom of tile?

      if (this.player.money < this.minBid) {
        this.$store.dispatch('playerEndGame', this.player);
      }
    },

    updateMonies({ money, bet }) {
      const player = this.player;
      console.log(player.name, bet);


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
