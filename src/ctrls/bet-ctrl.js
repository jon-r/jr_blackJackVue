import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="bet-ctrl" >
    <div class="ctrl-box" >
      <div class="betting-chip"
        v-for="chip in chips"
        v-if="chip <= maxChips"
        :class="'chip-' + chip"
        @click="add(chip)" >

        <svg class="token" viewBox="0 0 100 100" >
          <use xlink:href="#chip"/>
        </svg>
        <span class="chip-value" >£{{chip}}</span>
      </div>
      <button class="ctrl-btn"
        @click="emitBid"
        v-if="currChipValue >= minBid" >
        Submit Bid: £{{ currChipValue }}
      </button>
    </div>
    <ul class="chip-stack" v-if="currChips" >
      <li v-for="chip in currChips" :class="'chip-' + chip" @click="remove(chip)" >
        <svg class="token" viewBox="0 0 100 100" >
          <use xlink:href="#chip-tilt"/>
        </svg>
      </li>
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
      return this.player.money - this.currChipValue;
    },

    ...mapGetters([
      'minBid',
    ]),
  },
  methods: {

    add(chip) {
      this.currChipValue += chip;
      this.currChips.push(chip);
    },

    remove(chip) {
      const n = this.currChips.findIndex(isChip => isChip === chip);
      this.currChipValue -= chip;
      this.currChips.splice(n, 1);
    },

    emitBid() {
      const params = { bet: this.currChipValue, chips: this.currChips, firstBid: true };
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
