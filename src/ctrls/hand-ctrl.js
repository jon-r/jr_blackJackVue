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
      const firstCtrl = this.handRules.count < 3;
      const canAfford = (this.player.money >= this.player.firstBet);
      const canDouble = (firstCtrl && canAfford)
      const canSplit = (this.handRules.split && canAfford)

      return [
        { name: 'hit', canUse: true, icon: 'touch_app' },
        { name: 'stand', canUse: true, icon: 'pan_tool' },
        { name: 'split', canUse: canSplit, icon: 'call_split' },
        { name: 'surrender', canUse: firstCtrl, icon: 'flag' },
        { name: 'double', canUse: canDouble, icon: 'monetization_on' },
      ];
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
      const handEvent = {
        idx,
        type: 'card',
        value: ctrl,
      };

      store.dispatch('doEvent', handEvent);
      store.dispatch('setNewMessage', `${player.name} ${ctrl}s`);

      if (this.betCost(ctrl)) {
        const betVals = {
          idx,
          value: player.firstBet,
        };
        store.dispatch('playerSetBet', betVals);
      }
    },
  },
};
