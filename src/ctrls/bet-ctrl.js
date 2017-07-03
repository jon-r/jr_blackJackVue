import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="ctrl-menu" >
    <button class="betting-chip ctrl-btn"
      v-for="chip in chips"
      :disabled="(chip > maxChips) ? true : false"
      :class="'chip-' + chip"
      @click="addChip(chip)" >

      <span class="ctrl-btn-label" >£{{chip}}</span>

      <svg class="token ctrl-btn-icon" viewBox="0 0 100 100" >
        <use xlink:href="#chip"/>
      </svg>
    </button>

    <button class="ctrl-btn btn-good"
      @click="emitBet"
      :disabled="betErr ? true:false" >

      <span class="ctrl-btn-label" >
        Submit Bet: £{{ currChipValue }}
      </span>

      <i class="material-icons ctrl-btn-icon" >publish</i>

      <span class="error-text ctrl-btn-label" v-show="betErr"  >
        Min £{{betErr}}
      </span>
    </button>

    <button class="ctrl-btn btn-alert"
      @click="removeChip"
      :disabled="currChips.length === 0 ? true:false" >

      <span class="ctrl-btn-label" >Undo</span>

      <i class="material-icons ctrl-btn-icon" >undo</i>
    </button>
  </div>
  `,
  data() {
    return {
      chips: [5, 10, 25, 100, 500, 1000],
      currChips: [],
      currChipValue: 0,
    };
  },
  computed: {
    maxChips() {
      return this.player.money - this.currChipValue;
    },

    betErr() {
      return (this.currChipValue < this.minBet);
    },

    ...mapGetters([
      'minBet',
    ]),
  },
  methods: {

    addChip(chip) {
      this.currChipValue += chip;
      this.currChips.push(chip);
    },

    removeChip() {
      const chip = this.currChips.pop();
      this.currChipValue -= chip;
    },

    emitBet() {
      const player = this.player;
      const idx = player.index;
      const bet = this.currChipValue;
      const store = this.$store;

      const betVals = {
        idx,
        value: bet,
      };
      const betEvent = {
        idx,
        type: 'bet',
        value: 'addBet',
      };

      const msg = `${player.name} bets £${bet}`;

      this.currChips = [];
      this.currChipValue = 0;

      // todo combine these in store?
      store.dispatch('setNewMessage', msg);

      store.dispatch('playerSetBet', betVals)
        .then(() => store.dispatch('doEvent', betEvent))
        .then(() => store.dispatch('nextPlayer'));
    },
  },
};
