// @ts-expect-error - bad types
import { mapGetters } from 'vuex';
import {defineComponent, PropType} from "vue";
import button, {ButtonControlProps} from "./button.ts";
import {Player} from "../types/players.ts";
import {HandRules} from "../types/state.ts";

export default defineComponent({
  components: {
    'button-ctrl': button
  },
  props: {
    player: {type: Object as PropType<Player>, required: true}
  },
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
    ctrls(): ButtonControlProps[] {
      const player = this.player;
      const firstCtrl = (this.handRules as HandRules).count < 3;
      const canAfford = (player.money >= player.firstBet);
      const canDouble = (firstCtrl && canAfford);
      const canSplit = ((this.handRules as HandRules).split && canAfford);
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

    emitCtrl(ctrl: string) {
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
});
