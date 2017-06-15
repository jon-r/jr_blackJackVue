// import Vue from 'vue';
import { mapGetters } from 'vuex';

import HandCtrl from './hand-ctrl';
import BetCtrl from './bet-ctrl';
import OptionsCtrl from './options-ctrl';

export default {
  props: ['player'],
  template: `
  <section class="ctrl-frame" >

    <button class="btn menu-toggle material-icons" @click="showOptions = true" >menu</button>

    <options-ctrl v-if="showOptions" @hide="showOptions = false" ></options-ctrl>

    <template v-if="player" >

      <hand-ctrl v-if="canCtrl" :player="player" ></hand-ctrl>

      <bet-ctrl v-if="canBid" :money="player.money" ></bet-ctrl>

    </template>

  </section>`,
  components: {
    'hand-ctrl': HandCtrl,
    'bet-ctrl': BetCtrl,
    'options-ctrl': OptionsCtrl,
  },
  data() {
    return {
      showOptions: true,
    };
  },

  computed: {

    canBid() {
      return (this.gameStage === 0);
    },

    canCtrl() {
      return (this.gameStage === 3);
    },

    ...mapGetters([
      'dealer',
      'gameStage',
    ]),
  },

  methods: {

  },
  watch: {

  },
};
