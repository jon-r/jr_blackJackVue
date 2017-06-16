import { mapGetters } from 'vuex';

export default {
  props: ['player'],
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
        { name: 'hit', canUse: true },
        { name: 'stand', canUse: true },
        { name: 'split', canUse: this.canSplit },
        { name: 'surrender', canUse: this.firstCtrl },
        { name: 'double', canUse: this.canDouble },
      ];
    },

    firstCtrl() {
      return this.handRules.count < 3;
    },

    canAfford() {
      return this.player.money >= this.player.startBid;
    },

    canDouble() {
      return this.firstCtrl && this.canAfford;
    },

    canSplit() {
      return this.handRules.split && this.canAfford;
    },

    ...mapGetters([
      'handRules',
    ]),
  },
  methods: {
    emitCtrl(params) {
      const values = {
        target: this.player.index,
        type: 'card',
        params,
      };
      this.$store.dispatch('fireEventBus', values);
    },
  },
};
