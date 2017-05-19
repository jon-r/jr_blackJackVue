import PlayerHand from './player-hand';
import PlayerBet from './player-bet';

export default {
  props: ['shared', 'player'],
  template: `
  <section class="player-frame" :class="playerClass" >

    <h3 class="player-name" :class="{active: isPlayerTurn}" >{{player.name}}</h3>

    <player-hand
      :player="player"
      :shared="shared"
      :turn="isPlayerTurn"
      @bid-change="updateBid"
      @end-turn="endTurn" >
    </player-hand>

    <player-bet
      v-if="!player.isDealer"
      :shared="shared"
      :turn="isPlayerTurn"
      :wins="wins"
      @end-turn="endTurn" >
    </player-bet>

  </section>`,
  components: {
    'player-hand': PlayerHand,
    'player-bet': PlayerBet,
  },
  data() {
    return {
      playerClass: `player-${this.player.index}`,
      wins: 0,
    };
  },

  computed: {
    isPlayerTurn() {
      return this.shared.activePlayer === this.player.index;
    },
  },

  methods: {
    endTurn() {
      this.$emit('end-turn');
    },
    updateBid(value) {
      this.playerWins += value;
    },
  },
};
