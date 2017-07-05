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

//    <button class="ctrl-btn"
//      v-for="ctrl in ctrls"
//      :disabled="ctrl.canUse ? false:true"
//      :class="'ctrl-' + ctrl.name"
//      @click="setTurn(ctrl.name)" >
//
//      <span class="ctrl-btn-label" >{{ctrl.name}}</span>
//
//      <i class="material-icons ctrl-btn-icon" >{{ctrl.icon}}</i>
//    </button>

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
      const evt = (turn === 'new game') ? 'newGame' : 'nextRound';
      this.$store.dispatch(evt);
    },

  },
};
