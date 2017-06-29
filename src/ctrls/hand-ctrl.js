import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="ctrl-menu" >
    <button class="ctrl-btn"
      v-for="ctrl in ctrls"
      :disabled="ctrl.canUse ? false:true"
      :class="'ctrl-' + ctrl.name"
      @click="emitCtrl(ctrl.name)" >
      <span class="ctrl-btn-label" >{{ctrl.name}}</span>
      <i class="material-icons ctrl-btn-icon" >{{ctrl.icon}}</i>
      <span class="ctrl-btn-label alert-text" v-if="betCost(ctrl.name)" >- £{{player.firstBet}}</span>
    </button>
  </div>
  `,
  computed: {
    ctrls() {
      return [
        { name: 'hit', canUse: true, icon: 'touch_app' },
        { name: 'stand', canUse: true, icon: 'pan_tool' },
        { name: 'split', canUse: this.canSplit, icon: 'call_split' },
        { name: 'surrender', canUse: this.firstCtrl, icon: 'flag' },
        { name: 'double', canUse: this.canDouble, icon: 'monetization_on' },
      ];
    },

    firstCtrl() {
      return this.handRules.count < 3;
    },

    canAfford() {
      return this.player.money >= this.player.firstBet;
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

    betCost(name) {
      return (name === 'split' || name === 'double');
    },


    emitCtrl(ctrl) {
      const player = this.player;
      const idx = player.index;
      const store = this.$store;
      const msg = `${player.name} ${ctrl}s`;

      const handValues = {
        target: idx,
        type: 'card',
        params: ctrl, // RM
        string: ctrl,
      };

      store.dispatch('setNewMessage', msg);

      store.dispatch('fireEventBus', handValues); // FIXED
    },
  },
};
