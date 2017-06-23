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

    <button class="ctrl-btn btn-alert"
      @click="removeChip"
      :disabled="currChips.length === 0 ? true:false" >

      <span class="ctrl-btn-label" >Undo</span>

      <i class="material-icons ctrl-btn-icon" >undo</i>
    </button>

    <button class="ctrl-btn btn-good"
      @click="emitBid"
      :disabled="bidErr ? true:false" >

      <span class="ctrl-btn-label" >
        Submit Bid: £{{ currChipValue }}
      </span>

      <i class="material-icons ctrl-btn-icon" >publish</i>

      <span class="error-text ctrl-btn-label" v-show="bidErr"  >
        {{bidErr}}
      </span>

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

//    tooManyChips() {
//      return this.currChips.length > 11;
//    },

    bidErr() {
      return (this.currChipValue < this.minBid) ? `Min £${this.minBid}` : '';
    },

    ...mapGetters([
      'minBid',
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

    emitBid() {
      const params = { bet: this.currChipValue, firstBid: true };
      const values = {
        target: this.player.index,
        type: 'bid',
        params,
      };

      this.$store.dispatch('fireEventBus', values)
        .then(() => this.$store.dispatch('nextPlayer'));

      this.currChips = [];
      this.currChipValue = 0;
    },
  },
};
