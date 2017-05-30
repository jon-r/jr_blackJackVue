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

    <div class="player-ctrl" v-if="canCtrl" >
      <button
        v-for="ctrl in ctrls"
        v-if="ctrl.canUse"
        class="ctrl-btn" :class="'ctrl-' + ctrl.name"
        @click="ctrl.onClick" >
        {{ctrl.name}}
      </button>
    </div>
  </div>
  `,
  components: {
    'player-cards': PlayerCards,
  },
  data() {
    return {
      hands: [this.setBlankCard()],
      activeHand: 0,
      autoTime: 250,
    };
  },
  computed: {
    canCtrl() {
      return !this.player.isDealer && this.turn && this.shared.stage === 3;
    },

    ctrls() {
      return [
        { name: 'hit', canUse: true, onClick: this.hit },
        { name: 'stand', canUse: true, onClick: this.stand },
        { name: 'split', canUse: this.canSplit, onClick: this.split },
        { name: 'surrender', canUse: this.firstCtrl, onClick: this.surrender },
        { name: 'double', canUse: this.firstCtrl, onClick: this.double },
      ];
    },

    firstCtrl() {
      return this.hands[0].cards.length < 3;
    },

    canSplit() {
      const cards = this.hands[0].cards;
      if (cards.length !== 2) return false;

      const equalCards = cards[0].face === cards[1].face;
      const twoFace = cards[0].face > 10 && cards[1].face > 10;

      return equalCards || twoFace;
    },
  },
  methods: {

    // generic
    startTurn() {
      if (!this.turn) return false;

      const actions = new Map([
        [1, this.dealOutFirst],
        [2, this.dealOutFirst],
        [3, this.playerActions],
        [4, this.dealOutLast],
        [5, this.getFinalScores],
      ]);

      return actions.get(this.shared.stage)();
    },

    drawCard() {
      this.getActiveHand().cards.push(this.shared.deck.dealBlank());

      return this;
    },

    revealCard(card = false) {
      const newCard = card || this.shared.deck.deal();

      const activeHand = this.getActiveHand();
      if (activeHand.cards.length - 1 < activeHand.revealed) {
        this.drawCard();
      }
      setTimeout(() => {
        this.$set(activeHand.cards, activeHand.revealed, newCard);
        activeHand.revealed += 1;
      }, 200);

      return this;
    },

    getActiveHand() {
      return this.hands[this.activeHand];
    },

    nextHand() {
      if (this.hands.length - 1 === this.activeHand) {
        this.$emit('end-turn');
      } else {
        this.activeHand += 1;
      }
    },

    emitEndTurn(delay = 0) {
      setTimeout(() => this.$emit('end-turn'), delay);
    },

    // stage 0

    setBlankCard() {
      return { cards: [], score: 0, revealed: 0 };
    },

    setGame() {
      this.hands = [this.setBlankCard()];
      this.activeHand = 0;
    },

    // stage 1 - 2

    dealOutFirst() {
      const isLastCard = this.player.isDealer && this.shared.stage === 2;

      if (isLastCard) {
        this.drawCard().dealerPeekCheck();
      } else {
        this.revealCard();
      }

      this.emitEndTurn(this.autoTime);
    },

    dealerPeekCheck() {
      const activeHand = this.getActiveHand();
      const score = activeHand.score;

      if (score !== 10 && score !== 11) return false;

      const newCard = this.shared.deck.peek(score);

      this.revealCard(newCard);

      return true;
    },

    playerActions() {
      if (this.player.isDealer) {
        this.dealDealer();
      } else {
        this.autoSkipCheck();
      }
    },

    dealDealer() {
      setTimeout(() => {
        if (this.getActiveHand().score < 17) {
          this.revealCard().dealDealer();
        } else {
          this.emitEndTurn();
        }
      }, this.autoTime);
    },

    autoSkipCheck() {
      if (this.getActiveHand().score > 20) {
        this.nextHand();
      }
    },

    hit() {
      this.drawCard().revealCard();
      return this;
    },

    stand() {
      this.nextHand();
    },

    split() {
      this.emitBidChange('split');
      const splitCard = this.getActiveHand().cards.splice(1)[0];
      this.getActiveHand().revealed = 1;

      this.hands.push(this.setBlankCard());
      this.activeHand = 1;
      this.revealCard(splitCard);

      this.activeHand = 0;
    },

    double() {
      this.emitBidChange('double').drawCard().emitEndTurn(this.autoTime);
    },

    surrender() {
      this.emitBidChange('forfeit').emitEndTurn();
    },

    emitBidChange(str) {
      this.$emit('bid-change', str);
      return this;
    },

    // stage 3

    dealOutLast() {
      const activeHand = this.getActiveHand();

      let delay = 0;

      if (activeHand.cards.length - 1 > activeHand.revealed) {
        this.revealCard();
        delay = this.autoTime;
      }

      this.emitEndTurn(delay);
      return false;
    },

    // stage 4

    getFinalScores() {
      const hands = this.hands;
      // also filtering out any bust scores
      const bestScore = this.hands
        .map(hand => hand.score)
        .reduce((max, cur) => (cur > 21 ? max : Math.max(max, cur)), -Infinity);

      this.emitFinalScore(bestScore).emitEndTurn();

      return false;
    },

    emitFinalScore(bestScore) {
      this.$emit('input', bestScore);
      return this;
    },

  },
  watch: {
    'shared.roundID': 'setGame',

    turn: 'startTurn',
  },
};
