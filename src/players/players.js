import Vue from 'vue';
import gamePlay from '../game-data';
import CardHand from './card-hand';
import BetFrame from './bet-frame';

export default {
  props: ['name', 'idx'],
  template: `
  <section :class="playerClass" >
    <h3 class="player-name" :class="{active: playerTurn}" >{{name}}</h3>
    <card-hand :turn="playerTurn" :stage="shared.roundStage" >
    </card-hand>

    <div v-if="!isDealer" >
      <bet-frame :turn="playerTurn" ></bet-frame>
    </div>

  </section>`,
  components: {
    'card-hand': CardHand,
    'bet-frame': BetFrame,
  },
  data() {
    return {
      shared: gamePlay.state,
      canPlay: true,
      hands: [],
      score: 0,
      playerClass: `player-frame player-${this.idx}`,
      isDealer: +this.idx === 0,
    };
  },
  computed: {
    playerTurn() {
      return this.shared.activePlayer === this.idx;
    },
  },
};
