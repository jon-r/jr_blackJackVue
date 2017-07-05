import { mapGetters } from 'vuex';
import { arrayStaggeredPush, arrayStaggeredPull, setPos } from '../animationTools';

export default {
  props: ['turn', 'player', 'framepos'],
  template: `
  <div class="player-bet flex" >
    <transition-group class="chip-stack flex" name="bets" tag="ul" :class="{ show : quidsIn }"
      @after-enter="enterTo" @enter="enter" @leave="leave" >
      <li v-for="(chip, idx) in chips"
        :class="'chip-' + chip"
        :key="idx"
        :data-key="idx" >
        <svg viewBox="0 0 100 60" >
          <use class="token" xlink:href="#chip-tilt"/>
        </svg>
      </li>
    </transition-group>

    <span v-show="bet > 0" >Bet: £{{bet}}</span>

  </div>
  `,
  data() {
    return {
      bet: 0,
      quidsIn: false,
      chips: [],
      alreadyEnded: false,
    };
  },
  computed: {
    ...mapGetters([
      'gameRound',
      'eventBus',
      'eventID',
      'minBet',
    ]),
  },
  methods: {

    enter(el) {
      setPos(el, { x: 0, y: -200 });
    },

    enterTo(el, done) {
      requestAnimationFrame(() => {
        setPos(el, { x: 0, y: 0 });
      });
    },

    leave(el, done) {
      const frame = this.framepos;
      setPos(el, { x: 0, y: -frame.y });
      el.addEventListener('transitionend', () => {
        done();
      });
    },

    showChips() {
      this.quidsIn = true;
    },

    hideChips() {
      this.quidsIn = false;
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

    // todo bonus: make this a computed based on the bet?
    adjustChips(newBet) {
      if (newBet === 0) return false;

      const input = this.calcChips(Math.abs(newBet));
      const args = [input, this.chips, 100];
      let remaining;

      switch (true) {
      case (newBet < 0):
        remaining = arrayStaggeredPull(...args);
        return (remaining) ? this.splitChips(remaining) : true;
      case (newBet > 0):
        return arrayStaggeredPush(...args);
      default: // no change
        return false;
      }
    },

    splitChips(toRemove) {
      const removeTotal = toRemove.reduce((sum, value) => sum + value, 0);
      const chipsFilter = this.chips.filter(chip => chip > removeTotal);
      const lowestChip = Math.min(...chipsFilter); // the lowest chip that can be broken down;
      const newChips = this.calcChips(lowestChip - removeTotal);

      const rm = this.chips.indexOf(lowestChip);
      this.chips.splice(rm, 1);
      setTimeout(() => {
        arrayStaggeredPush(newChips, this.chips, 100);
      }, 100);
    },

    adjustBet() {
      const { idx, type, value } = this.eventBus;
      const isBetEvent = (idx === this.player.index) && (type === 'bet');
      const hasNoBet = (this.bet === 0 && value !== 'addBet');

      if (!isBetEvent || hasNoBet || this.alreadyEnded) return this;

      const betAdjust = {
        addBet: 1,
        forfeit: -0.5,
        lose: -1,
        push: 0,
        win: 1,
        blackJack: 1.5,
      };

      this.showChips();

      if (value === 'blackJack' || value === 'forfeit') this.alreadyEnded = true;

      const bet = this.player.firstBet * betAdjust[value];

      this.adjustChips(bet);
      this.bet += bet;

      return true;
    },

    cashIn(bet) {
      this.hideChips();

      this.alreadyEnded = false;

      this.emitMoneyChange(this.bet).then(() => {
        this.bet = 0;

        if (this.player.money < this.minBet) {
          this.$store.dispatch('playerEndGame', { idx: this.player.index, value: false });
        }
      });

      setTimeout(() => {
        this.chips = [];
      }, 1000);

      return true;
    },

    emitMoneyChange(value) {
      const idx = this.player.index;
      const betVals = { idx, value };
      return this.$store.dispatch('playerUpdateMoney', betVals);
    },

  },
  watch: {
    gameRound: 'cashIn',
    eventID: 'adjustBet',
  },
};
