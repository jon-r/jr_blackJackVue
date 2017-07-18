import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="ctrl-menu frame flex flex-wrap" >
    <button-ctrl
      v-for="(ctrl,j) in ctrls"
      :key="j" :ctrl="ctrl"
      @click.native="emitCtrl(ctrl.name)" >
    </button-ctrl>
  </div>
  `,
  computed: {
    ctrls() {
      const player = this.player;
      const firstCtrl = this.handRules.count < 3;
      const canAfford = (player.money >= player.firstBet);
      const canDouble = (firstCtrl && canAfford);
      const canSplit = (this.handRules.split && canAfford);
      const cost = `- £${player.firstBet}`;
      const returns = `+ £${player.firstBet / 2}`;

      return [
        { name: 'hit', canUse: true, icon: 'touch_app' },
        { name: 'stand', canUse: true, icon: 'pan_tool' },
        { name: 'split', canUse: canSplit, icon: 'call_split', alert: cost },
        { name: 'surrender', canUse: firstCtrl, icon: 'flag', alert: returns },
        { name: 'double', canUse: canDouble, icon: 'monetization_on', alert: cost },
      ];
    },

    ...mapGetters([
      'handRules',
    ]),
  },
  methods: {

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

      if (ctrl === 'split' || ctrl === 'double') {
        const betVals = {
          idx,
          value: -player.firstBet,
        };

        store.dispatch('playerUpdateMoney', betVals);
      }
    },
  },
};
