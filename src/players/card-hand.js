export default {
  props: ['turn', 'game', 'dealer'],
  template: `
  <div class="player-hand"  >
    <div v-for="hand in hands" >
      <div v-for="(card, idx) in hand.cards" class="card" :class="card.suit" >
        {{card.face}}
      </div>

      <div class="hand-score" >
        <span>{{hand.scoreStr}}</span>
      </div>
    </div>

    <div class="player-ctrl" v-if="canCtrl" >
    stage 3 controls
    </div>
  </div>
  `,
  data() {
    return {
      hands: [{ cards: [], score: 0, scoreStr: '', hardAce: true }],
      activeHand: 0,
    };
  },
  methods: {
    revealCard() {
      return this.game.deck.deal();
    },
    draw() {

    },
    autoDraw() {
      let card = { face: 'x', score: 0, suit: 'blank' };
      const lastCard = this.dealer && this.game.roundStage === 2;

      if (!lastCard) {
        card = this.revealCard();
      }

      this.pushToHand(card);

      setTimeout(() => this.$emit('end-turn'), 500);
    },
    pushToHand(newCard) {
      const hand = this.hands[this.activeHand];
      const cards = hand.cards;

      cards.push(newCard);

      const firstCards = cards.length < 3;
      const hasAce = firstCards && cards.some(card => card.face === 'A');

//      const newCardScore = (hasAce && !hand.hardAce && (newCard.face === 'A'))
//        ? 11
//        : newCard.score;

      const newScore = hand.score + newCard.score;

      if (newScore > 21 && hand.hardAce) {
        hand.score = newScore;
        hand.scoreStr = `Bust ${newScore}`;
        return this.endTurn();
      }

      if (newScore === 21 && firstCards) {
        hand.score = newScore;
        hand.scoreStr = `BlackJack ${newScore}`;
        return true;
      }

      if (newScore > 21 && !hand.hardAce) {
        hand.hardAce = true;
        hand.score = newScore;
        hand.scoreStr = newScore;
        return true;
      }

      if (newScore < 21 && hasAce) {
        hand.hardAce = false;
        hand.score = newScore + 10;
        hand.scoreStr = `Soft ${newScore}`;
        return true;
      }

      hand.score = newScore;
      hand.scoreStr = newScore;

      return true;
    },
    endTurn() {
      if (this.game.roundStage > 2) {
        return this.$emit('end-turn');
      }
      return false;
    },
    newGameReset() {
      this.hands = [{ cards: [], score: 0, scoreStr: '', hardAce: true }];
      this.activeHand = 0;
    },
  },
  watch: {
    'game.UID': 'newGameReset',
    turn() {
      if (!this.turn) {
        return false;
      }

      const stage = this.game.roundStage;

      if (stage === 1 || stage === 2) {
        // return this.drawCard();
        return this.autoDraw();
      }
      if (stage === 3 && this.dealer) {
        console.log('dealer draw');
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
