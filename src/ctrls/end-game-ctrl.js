import { mapGetters } from 'vuex';

export default {
  props: ['player'],
  template: `
  <div class="ctrl-menu" >
    <button class="ctrl-btn"
      v-for="ctrl in ctrls"
      :disabled="ctrl.canUse ? false:true"
      :class="'ctrl-' + ctrl.name"
      @click="setTurn(ctrl.name)" >

      <span class="ctrl-btn-label" >{{ctrl.name}}</span>

      <i class="material-icons ctrl-btn-icon" >{{ctrl.icon}}</i>
    </button>
  </div>
  `,
  computed: {

    enoughPlayers() {
      return this.activePlayerCount > 0;
    },

    ctrls() {
      return [
        { name: 'new game', canUse: true, icon: 'skip_previous' },
        { name: 'next round', canUse: this.enoughPlayers, icon: 'skip_next' },
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
      console.log(turn);
    },

  },
};
