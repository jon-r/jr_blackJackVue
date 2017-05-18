import game from '../game-play';

import PlayerHand from './player-hand';
import PlayerBet from './player-bet';

export default {
  props: ['name', 'idx'],
  template: `
  <section class="player-frame" :class="playerClass" >
    <h3 class="player-name" :class="{active: playerTurn}" >{{name}}</h3>

    <player-hand :dealer="isDealer" :turn="playerTurn" ></player-hand>

    <player-bet v-if="!isDealer" :turn="playerTurn" ></player-bet>
  </section>`,
  components: {
    'player-hand': PlayerHand,
    'player-bet': PlayerBet,
  },
  data() {
    return {
      game,
      playerClass: `player-${this.idx}`,
//      playerTurn: gamePlay.state.turn === this.idx,
    };
  },

//  watch: {
//    'gameState': {
//      handler: function updateTurn() {
//        console.log('turn updated watch');
//        this.playerTurn = this.gameState.turn === this.idx;
//      },
//      deep: true,
//    },
//
//  },
  computed: {
    isDealer() {
      return this.game.dealerID === this.idx;
    },
    playerTurn() {
      return this.game.state.turn === this.idx;
    },
  },
//  methods: {
//    endTurn() {
//      return this.$emit('end-turn');
//    },
//  },
};
