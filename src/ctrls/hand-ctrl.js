import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="player-ctrl" >
    <button class="ctrl-btn"
      v-for="ctrl in ctrls"
      v-if="ctrl.canUse"
      :class="'ctrl-' + ctrl.name"
      @click="emitCtrl(ctrl)" >
      {{ctrl.name}}
    </button>
  </div>
  `,
  computed: {
    ctrls() {
      return [
        { name: 'hit', canUse: true },
        { name: 'stand', canUse: true },
        { name: 'split', canUse: this.canSplit },
        { name: 'surrender', canUse: this.firstCtrl },
        { name: 'double', canUse: this.firstCtrl && this.canAfford },
      ];
    },

    firstCtrl() {
      return this.handRules.count < 3;
    },

    canAfford() {
      return this.player.money >= this.player.startBid;
    },

    canSplit() {
      return this.handRules.split && this.canAfford;
    },

    ...mapGetters([
      'handRules',
    ]),
  },
  methods: {
    emitCtrl(ctrl) {
      const type = 'cardFn';
      const func = ctrl.name;
      this.$store.dispatch('ctrlFunction', { type, func });
    },
  },
};
