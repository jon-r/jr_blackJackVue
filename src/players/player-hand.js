/* TODO: the cards need to update when a card is revealed. NOT when the card is dealt
  1) reset the reveal timout (it was working)
  2) set to be a pinging new card (see the money change ping/reset)
  3) since pinging new card, screokeeping can be optimised to only add a new card?
  4) also perhaps this ping change could be used elsewhere to (eg new round/game);
*/


import PlayerCards from './player-cards';

export default {
  props: ['turn', 'player', 'shared'],
  template: `
  <div class="player-hand" >

    <player-cards
      v-for="(hand, idx) in hands" :key="idx"
      :cards="hand.cards"
      @score-update="checkScore" >
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
      autoTime: 500,
    };
  },
  computed: {
    canCtrl() {
      return (this.turn && this.shared.stage === 3);
    },
  },
  methods: {
    dealOut() {
      const isLastCard = this.player.isDealer && this.shared.stage === 2;

      this.deal();
      if (!isLastCard) this.reveal();

      setTimeout(() => this.endTurn(), this.autoTime);
    },

    deal() {
      const activeCards = this.hands[this.activeHand].cards;
      activeCards.push({ face: 'x', score: 0, suit: 'blank' });

      return this;
    },

    reveal() {
      newCard = this.shared.deck.deal();
      this.$nextTick(() => {
        const activeCards = this.hands[this.activeHand].cards;
        const i = activeCards.findIndex(card => card.face === 'x');

        return this;
      });
    },

    checkScore(score) {
      if (!this.turn) {
        return false;
      }

      this.hands[this.activeHand].score = score;
      if (score > 20 && this.shared.stage === 3) this.nextHand();
      return score;
      // TODO set score to be max from all hands
    },

    nextHand() {
      this.activeHand += 1;
      if (this.hands.length === this.activeHand) this.$emit('end-turn');
    },

    newGameReset() {
      this.hands = [{ cards: [], score: 0 }];
      this.activeHand = 0;
    },

    doCtrl(ctrl) {
      return this[ctrl]();
    },

    hit() {
      this.deal().reveal();
    },

    stand() {
      this.nextHand();
    },

    split() {
      this.bidChange('split');
      const splitCard = this.hands[this.activeHand].cards.splice(1)[0];
      this.hands.push({ cards: [splitCard], score: splitCard.score });
    },

    double() {
      this.bidChange('double')
        .deal()
        .endTurn();
    },

    forfeit() {
      this.bidChange('forfeit')
        .endTurn();
    },

    dealerDraw() {
      if (this.hands[0].score > 20) {
        return this.endTurn();
      }
      setTimeout(() => this.hit().dealerDraw(), this.autoTime);
      return true;
    },

    bidChange(str) {
      this.$emit('bid-change', str);
      return this;
    },

    endTurn() {
      this.$emit('end-turn');
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
        return this.dealerDraw();
      }
      return false;
    },
  },
};
