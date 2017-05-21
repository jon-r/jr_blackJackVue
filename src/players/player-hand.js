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
      hands: this.getBlank(),
      firstCtrl: true,
      activeHand: 0,
      ctrls: ['hit', 'stand', 'split', 'surrender', 'double'],
      autoTime: 200,
    };
  },
  computed: {
    canCtrl() {
      return (this.turn && this.shared.stage === 3);
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
    getBlank() {
      return [{ cards: [], score: 0 }];
    },

    dealOut() {
      const isLastCard = this.player.isDealer && this.shared.stage === 2;

      this.deal(!isLastCard);

      setTimeout(() => this.endTurn(), this.autoTime);
    },

    deal(showCard = false) {
      const active = this.hands[this.activeHand];

      const newCard = showCard
        ? this.shared.deck.deal()
        : { face: 'x', score: 0, suit: 'blank' };

      const firstBlank = active.cards.findIndex(card => card.face === 'x');

      if (newCard.face === 'x' || firstBlank === -1) {
        active.cards.push(newCard);
        return this;
      }

      active.cards[firstBlank] = newCard;

      return this;
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
      this.hands = this.getBlank();
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
      const firstCardFace = cards[0].face;

      return cards.every(card => card.face === firstCardFace);
    },

    double() {
      this.bidChange('double').deal().endTurn();
    },

    surrender() {
      this.bidChange('forfeit').endTurn();
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
