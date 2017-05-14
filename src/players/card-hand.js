import PlayingCard from './playing-card';
import gamePlay from '../game-data';

export default {
  props: ['turn', 'stage'],
  template: `
  <div class="player-hand"  >
    <div v-for="hand in hands" >
      <playing-card
        v-for="(card, idx) in hand.cards"
        :key="idx"
        :card="card" >
      </playing-card>
      <span class="hand-score">{{hand.score}}</span>
    </div>

    <div class="player-ctrl" v-if="turn && shared.roundStage === 3" >
    stage 3 controls
    </div>
  </div>
  `,
  components: {
    'playing-card': PlayingCard,
  },
  data() {
    return {
      shared: gamePlay.state,
      hands: [{ cards: [], score: 0 }],
      activeHand: 0,
      // playerScore: 0,
    };
  },
  methods: {
    drawCard() {
      const newCard = this.shared.deck.deal();

      this.hands[this.activeHand].cards.push(newCard);
    },
    autoDraw() {
      this.drawCard();
      setTimeout(gamePlay.nextPlayer, 500);
    },

  },
  watch: {
    turn() {
      if (!this.turn) {
        return false;
      }
      if (this.stage === 1 || this.stage === 2) {
        return this.drawCard();
          // return this.autoDraw();
      }
      return false;
    },
  },
  computed: {
    // canDraw() {
    //   console.log(this.stage);
    //   return ;
    // },

    // playerActive() {
    //   const stage = this.stage;
    //   const active = (stage > 0) && this.turn;
    //
    //   console.log(stage);
    //
    //   if (!active) {
    //     return false;
    //   }
    //
    //   if (stage === 1 || stage === 2) {
    //     return this.autoDraw();
    //   }
    //
    // },
  },

};
