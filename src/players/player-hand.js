import game from '../game-play';
import PlayerCards from './player-cards';

export default {
  props: ['turn', 'dealer'],
  template: `
  <div class="player-hand" >
    <player-cards
      v-for="(hand, idx) in hands" :key="idx"
      :cards="hand.cards"
      :value="cardValue"
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
      game,
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
      const isLastCard = this.dealer && this.game.state.stage === 2;

      const newCard = this.drawCard(isLastCard);
      this.pushToHand(newCard);


      setTimeout(() => this.game.endTurn(), 500);
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
      return this.game.endTurn();
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
    'game.state.roundID': 'newGameReset',
    turn() {
      if (!this.turn) {
        return false;
      }

      const stage = this.game.state.stage;

      console.log(stage);


      if (stage === 1 || stage === 2) {
        console.log('dealing out');
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
      return (this.turn && this.game.state.stage === 3);
    },
  },
};
