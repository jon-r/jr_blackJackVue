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

      const bidvals = {
        idx: this.player.index,
        value: this.currChipValue,
      };

      const msg = `${this.player.name} bets £${this.currChipValue}`;

//      const msgValues = {
//        type: 'message',
//        params: `${this.player.name} bets £${this.currChipValue}`, // RM
//        string: ,
//      };

      // TODO = newBid (change to setter rather than evt trigger);
      this.$store.dispatch('playerSetBid', bidvals);
      this.$store.dispatch('setNewMessage', msg);
      this.$store.dispatch('nextPlayer');

      this.currChips = [];
      this.currChipValue = 0;
    },
  },
};
