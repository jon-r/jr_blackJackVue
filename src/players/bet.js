import { mapGetters } from 'vuex';
import { runLerpLoop, setStartFinish, setTarget, arrayStaggeredPush, arrayStaggeredPull } from '../animationTools';

// TODO: set bets at chips instead of numbers
export default {
  props: ['turn', 'player', 'framepos'],
  template: `
  <div class="player-bet" >
    <span v-show="bet > 0" >Bet: £{{bet}}</span>

    <transition-group class="chip-stack" name="bets" tag="ul" :class="{ show : quidsIn }"
      @before-enter="beforeEnter" @enter="enter" @leave="leave" >
      <li v-for="(chip, idx) in chips"
        :class="'chip-' + chip"
        :key="idx"
        :data-key="idx" >
        <svg viewBox="0 0 100 60" >
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
      quidsIn: false,
      chips: [],
    };
  },
  computed: {

    leavePosition() {
      const frame = this.framepos;
      return { x: 0, y: -frame.y };
    },

    ...mapGetters([
      'gameRound',
      'eventBus',
      'eventID',
      'minBet',
    ]),
  },
  methods: {

    beforeEnter(el) {
      const start = { x: 0, y: -200, r: 0 };

      setStartFinish(el, { start });
    },
    enter(el, done) {
      runLerpLoop(el, done, 50);
    },
    leave(el, done) {
      const target = this.leavePosition;
      setTarget(el, target);
      runLerpLoop(el, done, 50);
    },

    resetBet() {
      this.chips = [];
    },

    showChips() {
      this.quidsIn = true;
    },

    hideChips() {
      this.quidsIn = false;
      console.log('quids out');
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

    // todo make this a computed based on the bet?
    adjustChips(newBet) {
      if (newBet === 0) return false;

      const array = this.chips;
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

    adjustBet() {
      const { idx, type, value } = this.eventBus;
      const isBetEvent = (idx === this.player.index) && (type === 'bet');

      if (!isBetEvent) return this;

     // if (this.bet === 0 && !firstBet) return this;
      // is this still a thing?

      const betAdjust = {
        addBet: 1,
        forfeit: -0.5,
        lose: -1,
        push: 0,
        win: 1,
        blackJack: 1.5,
      };

      this.showChips();

      const firstBet = this.player.firstBet;
      const bet = firstBet * betAdjust[value];

      this.adjustChips(bet);
      this.bet += bet;

      const moneyChange = (value === 'addBet') ? -firstBet : this.bet;

      // TODO fix splits ending both hands

      setTimeout(() => {
        this.emitMoneyChange(moneyChange);
        if (value !== 'addBet') this.cashIn(); // THIS IS BREAKING SPLITS??
      });

      return this;
    },

    cashIn() {
      console.log('cash in');

      this.bet = 0;
      this.hideChips();

      if (this.player.money < this.minBet) {
        this.$store.dispatch('playerEndGame', this.player);
      }
    },

    emitMoneyChange(value) {
      const idx = this.player.index;
      const betVals = { idx, value };
      this.$store.dispatch('playerUpdateMoney', betVals);
    },

  },
  watch: {
    gameRound: 'resetBet',
    eventID: 'adjustBet',
  },
};
