import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="ctrl-menu frame-thick flex flex-wrap" >
    <button-ctrl
      v-for="(ctrl,j) in ctrls"
      :key="j" :ctrl="ctrl"
      @click.native="setTurn(ctrl.name)" >
    </button-ctrl>
  </div>
  `,

  computed: {

    ctrls() {
      const hasPlayers = this.activePlayerCount > 0;

      return [
        { name: 'new game', canUse: true, icon: 'skip_previous' },
        { name: 'next round', canUse: hasPlayers, icon: 'skip_next' },
      ];
    },

    ...mapGetters([
      'activePlayerCount',
    ]),

  },
  methods: {

    setTurn(turn) {
      const store = this.$store;

      if (turn === 'next round') {
        return store.dispatch('nextRound');
      }

      const gameEvent = { type: 'newGame' };
      return store.dispatch('doEvent', gameEvent);
    },

  },
};
