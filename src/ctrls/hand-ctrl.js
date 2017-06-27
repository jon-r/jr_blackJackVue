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
      <span class="ctrl-btn-label alert-text" >{{bidCost(ctrl.name)}}</span>
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

    bidCost(name) {
      return (name === 'split' || name === 'double') ? `+ £${this.player.startBid}` : '';
    },

    emitCtrl(params) {
      const message = `${this.player.name} ${params}s`;
      const msgValues = {
        type: 'message',
        params: message,
      };

      const handValues = {
        target: this.player.index,
        type: 'card',
        params,
      };
      this.$store.dispatch('fireEventBus', msgValues)
        .then(() => this.$store.dispatch('fireEventBus', handValues));
    },
  },
};
