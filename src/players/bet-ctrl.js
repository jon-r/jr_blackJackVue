import { mapGetters } from 'vuex';

export default {
  props: ['money'],
  template: `
  <div class="bet-ctrl" >
    <button class="ctrl-btn"
      v-for="chip in chips"
      v-if="chip <= maxChips"
      :class="'chip-' + chip"
      @click="increment(chip)" >
      £{{chip}}
    </button>
    <button class="ctrl-btn"
      @click="emitBid"
      v-if="currChipValue >= minBid" >
      Submit Bid: £{{ currChipValue }}
    </button>
    <ul v-if="currChips" >
      <li v-for="chip in currChips" >{{ chip }}</li>
    </ul>
  </div>
  `,
  data() {
    return {
      chips: [5, 10, 25, 100, 500],
      currChips: [],
      currChipValue: 0,
    };
  },
  computed: {
    maxChips() {
      return this.money - this.currChipValue;
    },


    ...mapGetters([
      'minBid',
    ]),
  },
  methods: {

    increment(chip) {
      // TODO: visual pile of chips
      this.currChipValue += chip;
      this.currChips.push(chip);
    },
    emitBid() {
      this.$emit('pushBet', { bet: this.currChipValue, chips: this.currChips });
      this.currChips = [];
      this.currChipValue = 0;
    },
  },
};
