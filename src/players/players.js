import Vue from 'vue';
// import gamePlay from '../game-data';
import CardHand from './card-hand';
import BetFrame from './bet-frame';

export default {
  props: ['name', 'idx', 'game'],
  template: `
  <section :class="playerClass" >
    <h3 class="player-name" :class="{active: playerTurn}" >{{name}}</h3>

    <card-hand :dealer="isDealer" :turn="playerTurn" :game="game" @end-turn="endTurn" ></card-hand>

    <bet-frame v-if="!isDealer" :turn="playerTurn" :game="game" @end-turn="endTurn" ></bet-frame>
  </section>`,
  components: {
    'card-hand': CardHand,
    'bet-frame': BetFrame,
  },
  data() {
    return {
//      shared: gamePlay.state,
      canPlay: true,
      hands: [],
      score: 0,
      playerClass: `player-frame player-${this.idx}`,
      isDealer: +this.idx === this.game.players.length - 1,
    };
  },
  watch: {
    playerTurn() {
      if (this.isDealer && this.game.roundStage === 0) {
        return this.endTurn();
      }
      return false;
    },
  },
  computed: {
    playerTurn() {
      return this.game.activePlayer === this.idx;
    },
  },
  methods: {
    endTurn() {
      return this.$emit('end-turn');
    },
  },
};
