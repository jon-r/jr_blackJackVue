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
      hands: this.setBlankCard(),
      firstCtrl: true,
      activeHand: 0,
      autoTime: 200,
    };
  },
  computed: {
    canCtrl() {
      if (!this.turn) return false;

      return this.startTurn();
    },
    ctrls() {
      if (this.player.isDealer) return false;

      const firstCtrlOnly = this.firstCtrl;
      const canSplit = this.canSplit();

      return [
        { name: 'hit', canUse: true, onClick: this.hit },
        { name: 'stand', canUse: true, onClick: this.stand },
        { name: 'split', canUse: canSplit, onClick: this.split },
        { name: 'surrender', canUse: firstCtrlOnly, onClick: this.surrender },
        { name: 'double', canUse: firstCtrlOnly, onClick: this.double },
      ];
    },
  },
  methods: {

    setBlankCard() {
      return [{ cards: [], score: 0 }];
    },

    setGame() {
      this.hands = this.setBlankCard();
      this.activeHand = 0;
      this.firstCtrl = true;
    },

    startTurn() {
      // dealing out all cards
      const stage = this.shared.stage;

      if (stage === 1 || stage === 2) {
        this.dealOutFirst();
      }

      if (stage === 3) {
        if (this.player.isDealer) {
          this.dealDealer();
          return false;
        }

        this.autoSkip();
        return true;
      }

      if (stage === 4) {
        this.dealOutLast();
      }

      if (stage === 5) {
        this.getFinalScores();
      }

      return false;
    },

    deal(showCard = false) {
      const deck = this.shared.deck;

      const newCard = showCard
        ? deck.deal()
        : deck.dealBlank();

      const activeCards = this.getActiveHand().cards;

      const firstBlank = this.getFirstBlank(activeCards);

      if (newCard.face === 'x' || firstBlank === -1) {
        activeCards.push(newCard);
        return this;
      }

      this.$set(activeCards, firstBlank, newCard);

      return this;
    },

    dealOutFirst() {
      const isLastCard = this.player.isDealer && this.shared.stage === 2;

      if (isLastCard) return this.dealerPeek();

      this.deal(true);

      setTimeout(() => this.emitEndTurn(), this.autoTime);

      return false;
    },

    dealOutLast() {
      console.log('end game');

      const activeCards = this.getActiveHand(true).cards;

      let delay = 0;

      if (this.getFirstBlank(activeCards) > -1) {
        this.deal(true);
        delay = this.autoTime;
      }

      setTimeout(() => this.emitEndTurn(), delay);
      return false;
    },

    dealDealer() {
      const score = this.getActiveHand().score;

      setTimeout(() => {
        if (this.getActiveHand().score < 17) {
          this.deal(true).dealDealer();
        } else {
          this.emitEndTurn();
        }
      }, this.autoTime);

      return false;
    },

    dealerPeek() {
      console.log('peek');
      const activeHand = this.getActiveHand();
      const score = activeHand.score;

      if (score !== 10 && score !== 11) return this.deal();
      console.log(`peeking with ${score}`);

      const newCard = this.shared.deck.peek(score);

      activeHand.cards.push(newCard);

      setTimeout(() => this.emitEndTurn(), this.autoTime);

      return false;
    },

    getFirstBlank(activeCards) {
      return activeCards.findIndex(card => card.face === 'x');
    },

    getActiveHand(forceFirst = false) {
      const hand = forceFirst ? 0 : this.activeHand;
      return this.hands[hand];
    },

    nextHand() {
      this.activeHand += 1;
      if (this.hands.length === this.activeHand) this.$emit('end-turn');
    },

    autoSkip() {
      if (this.getActiveHand().score > 20) {
        console.log('skipped');
        this.nextHand();
        return false;
      }
      return true;
    },

    hit() {
      this.deal(true);
      return this;
    },

    stand() {
      this.nextHand();
    },

    split() {
      this.emitBidChange('split');
      const splitCard = this.getActiveHand().cards.splice(1)[0];
      this.hands.push({ cards: [splitCard], score: splitCard.score });
    },

    canSplit() {
      const cards = this.getActiveHand().cards;
      if (cards.length !== 2) return false;

      return (cards[0].face === cards[1].face);
    },

    double() {
      this.emitBidChange('double').deal().emitEndTurn();
    },

    surrender() {
      this.emitBidChange('forfeit').emitEndTurn();
    },

    getFinalScores() {
      const hands = this.hands;
      // also filtering out any bust scores
      const bestScore = this.hands
        .map(hand => hand.score)
        .reduce((max, cur) => (cur > 21 ? max : Math.max(max, cur)), -Infinity);

      this.emitFinalScore(bestScore).emitEndTurn();

      return false;
    },

    emitBidChange(str) {
      this.$emit('bid-change', str);
      return this;
    },

    emitEndTurn() {
      this.$emit('end-turn');
    },

    emitFinalScore(bestScore) {
      this.$emit('input', bestScore);
      return this;
    },

  },
  watch: {
    'shared.roundID': 'setGame',

  },
};
