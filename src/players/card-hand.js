import PlayingCard from './playing-card';
import gamePlay from '../game-data';

export default {
  props: ['turn', 'game', 'dealer'],
  template: `
  <div class="player-hand"  >
    <div v-for="hand in hands" >
      <playing-card
        v-for="(card, idx) in hand.cards"
        :key="idx"
        :card="card" >
      </playing-card>
      <div class="hand-score" >
        <span>Score: {{hand.score}}</span>
      </div>
    </div>

    <div class="player-ctrl" v-if="canCtrl" >
    stage 3 controls
    </div>
  </div>
  `,
  components: {
    'playing-card': PlayingCard,
  },
  data() {
    return {
//       shared: gamePlay.state,
      hands: [{ cards: [], score: 0 }],
      activeHand: 0,
      // playerScore: 0,
    };
  },
  methods: {
    revealCard() {
      return this.game.deck.deal();
    },
    draw() {

    },
    autoDraw() {
      let card = [];
      const lastCard = this.dealer && this.game.roundStage === 2;

      if (!lastCard) {
        card = this.revealCard();
      }

      this.hands[0].cards.push(card);

      setTimeout(() => this.$emit('end-turn'), 500);
    },
  },
  watch: {
    turn() {
      if (!this.turn) {
        return false;
      }
      if (this.game.roundStage === 1 || this.game.roundStage === 2) {
        // return this.drawCard();
        return this.autoDraw();
      }
      return false;
    },
  },
  computed: {
    canCtrl() {
      return (this.turn && this.game.roundStage === 3);
    },
  },

};
