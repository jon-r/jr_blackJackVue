import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="ctrl-menu frame flex flex-wrap" >

    <button-ctrl
      v-for="(ctrl,i) in ctrlBets"
      :key="i" :ctrl="ctrl"
      @click.native="addChip(ctrl.ref)" >
    </button-ctrl>

    <button-ctrl
      v-for="(ctrl,j) in ctrlSubmits"
      :key="j" :ctrl="ctrl"
      @click.native="ctrl.onClick()" >
    </button-ctrl>

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
    ctrlBets() {
      const maxChips = (this.player.money - this.currChipValue);

      return this.chips.map((chip) => {
        const canUse = chip <= maxChips;
        return {
          ref: chip,
          name: `£${chip}`,
          class: `betting-chip chip-${chip}`,
          svg: '#chip',
          canUse,
          onClick: this.addChip,
        };
      });
    },

    ctrlSubmits() {
      const bet = this.currChipValue;
      const canUse = (bet >= this.minBet);
      const betStr = canUse ? `Submit: £${bet}` : 'Submit';
      const alert = `Min: £${this.minBet}`;

      return [
        { name: betStr, class: 'btn-good', icon: 'publish', canUse, onClick: this.emitBet, alert },
        { name: 'Undo', class: 'btn-alert', icon: 'undo', canUse: bet > 0, onClick: this.removeChip },
      ];
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

      this.currChips = [];
      this.currChipValue = 0;

      // todo bonus combine these in store?
      store.dispatch('setNewMessage', `${player.name} bets £${bet}`);

      store.dispatch('playerSetBet', betVals)
        .then(() => store.dispatch('doEvent', betEvent))
        .then(() => store.dispatch('nextPlayer'));
    },
  },
};
