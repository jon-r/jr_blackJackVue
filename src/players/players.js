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
      playerClass: `player-frame player-${this.idx}`,
      isDealer: +this.idx === this.game.dealerID,
    };
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
