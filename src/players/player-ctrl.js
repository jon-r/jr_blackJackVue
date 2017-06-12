

export default {
  props: ['hand', 'player'],
  template: `
  <div class="player-ctrl" >
    <button class="ctrl-btn"
      v-for="ctrl in ctrls"
      v-if="ctrl.canUse"
      :class="'ctrl-' + ctrl.name"
      @click="emitCtrl(ctrl.name)" >
      {{ctrl.name}}
    </button>
  </div>
  `,
  computed: {

    ctrls() {
      return [
        { name: 'hit', canUse: true, onClick: this.hit },
        { name: 'stand', canUse: true, onClick: this.stand },
        { name: 'split', canUse: this.canSplit && this.canAfford, onClick: this.split },
        { name: 'surrender', canUse: this.firstCtrl, onClick: this.surrender },
        { name: 'double', canUse: this.firstCtrl && this.canAfford, onClick: this.double },
      ];
    },

    firstCtrl() {
      return this.hand.revealed < 3;
    },

    canAfford() {
      return this.player.money > this.player.startBid;
    },

    canSplit() {
      const cards = this.hand.cards;
      return (this.hand.revealed === 2 && (cards[0].face === cards[1].face));
    },

  },
  methods: {
    emitCtrl(name) {
      this.$emit('ctrl', name);
    },
  },
};
