import CardsHeld from './cards-held';

export default {
  props: ['turn', 'game', 'dealer'],
  template: `
  <div class="player-hand"  >
    <cards-held
      v-for="(hand, idx) in hands" :key="idx"
      :cards="hand.cards"
      :value="cardValue"
      :game="game"
      @cardResult="checkScore" >
    </cards-held>

    <div class="player-ctrl" v-if="canCtrl" >
      <button
        v-for="ctrl in ctrls"
        class="ctrl-btn" :class="'ctrl-' + ctrl"
        @click="doCtrl(ctrl)" >
        {{ctrl}}
      </button>
    </div>
  </div>
  `,
  components: {
    'cards-held': CardsHeld,
  },
  data() {
    return {
      hands: [{ cards: [], score: 0 }],
      activeHand: 0,
      ctrls: ['hit', 'stand', 'split', 'forfeit', 'double'],
      dealt: {},
      cardValue: 0,
    };
  },
  methods: {
    drawCard(isBlank = false) {
      return isBlank
        ? { face: 'x', score: 0, suit: 'blank' }
        : this.game.deck.deal();
    },
    dealOut() {
      // let card = ;
      const isLastCard = this.dealer && this.game.roundStage === 2;

      const newCard = this.drawCard(isLastCard);
      this.pushToHand(newCard);

      setTimeout(() => this.$emit('end-turn'), 500);
    },
    pushToHand(newCard) {
      this.cardValue = newCard.score;
      this.hands[this.activeHand].cards.push(newCard);
    },
    checkScore(score, skip) {
      this.score = score;
      if (skip) this.nextHand();
    },
    nextHand() {
      if (this.hands.length > this.activeHand + 1) {
        this.activeHand += 1;
        return true;
      }
      return this.$emit('end-turn');
    },
    newGameReset() {
      this.hands = [{ cards: [], score: 0 }];
      this.activeHand = 0;
    },
    doCtrl(ctrl) {
      return this[ctrl]();
    },
    hit() {
      console.log('player-hit');
      const newCard = this.drawCard();
      this.pushToHand(newCard);
    },
    stand() {
      console.log('player-stand');
      this.nextHand();
    },
    split() {
      console.log('player-split');
    },
    double() {
      console.log('player-double');
    },
    forfeit() {
      console.log('player-forfeit');
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
        return this.dealOut();
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
