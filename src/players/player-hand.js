import PlayerCards from './player-cards';

export default {
  props: ['turn', 'player', 'shared'],
  template: `
  <div class="player-hand" >
    <player-cards
      v-for="(hand, idx) in hands" :key="idx"
      :cards="hand.cards"
      :value="cardValue"
      :shared="shared"
      @cardResult="checkScore" >
    </player-cards>

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
    'player-cards': PlayerCards,
  },
  data() {
    return {
      hands: [{ cards: [], score: 0 }],
      activeHand: 0,
      ctrls: ['hit', 'stand', 'split', 'forfeit', 'double'],
      cardValue: 0,
    };
  },
  methods: {
    drawCard(isBlank = false) {
      return isBlank
        ? { face: 'x', score: 0, suit: 'blank' }
        : this.shared.deck.deal();
    },
    dealOut() {
      const isLastCard = this.player.isDealer && this.shared.stage === 2;

      const newCard = this.drawCard(isLastCard);
      this.pushToHand(newCard);

      setTimeout(() => this.$emit('end-turn'), 500);
    },
    pushToHand(newCard) {
      this.cardValue = newCard.score;
      this.hands[this.activeHand].cards.push(newCard);
    },
    checkScore(score, skip) {
      // TODO set score to be max from all hands
      this.player.score = score;
      if (skip) this.nextHand();
    },
    nextHand() {
      this.activeHand += 1;

      if (this.hands.length > this.activeHand) {
        return true;
      }

      return this.$emit('end-turn');
    },
    newGameReset() {
      this.hands = [{ cards: [], score: 0 }];
      this.activeHand = 0;
      this.cardValue = 0;
    },
    doCtrl(ctrl) {
      return this[ctrl]();
    },
    hit() {
      const newCard = this.drawCard();
      this.pushToHand(newCard);
    },
    stand() {
      this.nextHand();
    },
    split() {
      this.$emit('bid-change', 'split');

      const newCard = this.hands[this.activeHand].cards.splice(1);
      this.hands.push({ cards: [newCard], score: newCard.score);
    },
    double() {
      this.$emit('bid-change', 'double');
      this.hit();
      return this.emit('end-turn');
    },
    forfeit() {
      this.$emit('bid-change', 'forfeit');
      return this.$emit('end-turn');
    },
  },
  watch: {
    'shared.roundID': 'newGameReset',
    turn() {
      if (!this.turn) {
        return false;
      }

      const stage = this.shared.stage;

      if (stage === 1 || stage === 2) {
        return this.dealOut();
      }
      if (stage === 3 && this.player.isDealer) {
        console.log('dealer draw');
      }
      return false;
    },
  },
  computed: {
    canCtrl() {
      return (this.turn && this.shared.stage === 3);
    },
  },
};
