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
      v-model="hand.score" >
    </player-cards>
    activeHand {{activeHand}}

    <div class="player-ctrl" v-if="canCtrl" >
      <button
        v-for="ctrl in ctrls"
        v-if="canDo[ctrl]"
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
      hands: this.setBlankCard(),
      firstCtrl: true,
      activeHand: 0,
      ctrls: ['hit', 'stand', 'split', 'surrender', 'double'],
      autoTime: 200,
    };
  },
  computed: {
    canCtrl() {
      if (!this.turn) return false;

      const stage = this.shared.stage;

      return this.startTurn(stage);
    },
    canDo() {
      const firstCards = this.hands[0].cards;
      return {
        hit: true,
        stand: true,
        split: this.firstCtrl && this.canSplit(),
        surrender: this.firstCtrl,
        double: this.firstCtrl,
      };
    },
  },
  methods: {

    startTurn(stage) {
      // dealing out all cards
      if (stage === 1 || stage === 2) {
        this.dealOut();
        return false;
      }

      if (stage === 3 && this.player.isDealer) {
        this.dealerDraw();
        return false;
      }

      if (stage === 3) {
        this.forceNextHand();
        return true;
      }

      if (stage === 4) {
        this.submitScore();
        return false;
      }

      return false;
    },

    dealOut() {
      const isLastCard = this.player.isDealer && this.shared.stage === 2;

      this.deal(!isLastCard);

      setTimeout(() => this.endTurn(), this.autoTime);
    },

    deal(showCard = false) {
      const activeCards = this.hands[this.activeHand].cards;

      const newCard = showCard
        ? this.shared.deck.deal()
        : { face: 'x', score: 0, suit: 'blank' };

      const firstBlank = activeCards.findIndex(card => card.face === 'x');

      if (newCard.face === 'x' || firstBlank === -1) {
        activeCards.push(newCard);
        return this;
      }

      this.$set(activeCards, firstBlank, newCard);

      return this;
    },

    nextHand() {
      this.activeHand += 1;
      if (this.hands.length === this.activeHand) this.$emit('end-turn');
    },

    forceNextHand() {
      if (this.hands[this.activeHand].score > 20) {
        this.nextHand();
      }
    },

    newGameReset() {
      this.hands = this.setBlankCard();
      this.activeHand = 0;
      this.firstCtrl = true;
    },

    doCtrl(ctrl) {
      this.firstCtrl = false;
      return this[ctrl]();
    },

    hit() {
      this.deal(true);
      return this;
    },

    stand() {
      this.nextHand();
    },

    split() {
      this.bidChange('split');
      const splitCard = this.hands[0].cards.splice(1)[0];
      this.hands.push({ cards: [splitCard], score: splitCard.score });
    },

    canSplit() {
      const cards = this.hands[0].cards;
      if (cards.length === 0) return false;

      const firstCardFace = cards[0].face;
      return cards.every(card => card.face === firstCardFace);
    },

    double() {
      this.bidChange('double').deal().endTurn();
    },

    surrender() {
      this.bidChange('forfeit').endTurn();
    },

    bidChange(str) {
      this.$emit('bid-change', str);
      return this;
    },

    dealerDraw() {
      this.hit();

      setTimeout(() => {
        if (this.hands[0].score < 17) {
          this.dealerDraw();
        } else {
          this.endTurn();
        }
      }, 1000);
    },

    endTurn() {
      this.$emit('end-turn');
    },

    setBlankCard() {
      return [{ cards: [], score: 0 }];
    },

    submitScore() {
      // also filtering out any bust scores
      const allScores = this.hands.map(hand => (hand.score > 21 ? 0 : hand.score));

      const bestScore = Math.max(...allScores);

      this.$emit('input', bestScore);
    },
  },
  watch: {
    'shared.roundID': 'newGameReset',
    hands: { handler: 'forceNextHand', deep: true },
  },
};
