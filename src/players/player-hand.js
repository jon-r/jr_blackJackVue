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

      setTimeout(() => this.$emit('game-msg', 'endTurn'), 500);
    },
    pushToHand(newCard) {
      this.cardValue = newCard.score;
      this.hands[this.activeHand].cards.push(newCard);
    },
    checkScore(score, skip) {
      this.player.score = score;
      if (skip) this.nextHand();
    },
    nextHand() {
      this.activeHand += 1;

      if (this.hands.length > this.activeHand) {
        return true;
      }

      return this.$emit('game-msg', 'endTurn');
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
