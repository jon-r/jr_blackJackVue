/* TODO: the cards need to update when a card is revealed. NOT when the card is dealt
  1) reset the reveal timout (it was working)
  2) set to be a pinging new card (see the money change ping/reset)
  3) since pinging new card, screokeeping can be optimised to only add a new card?
  4) also perhaps this ping change could be used elsewhere to (eg new round/game);
*/

import { mapGetters } from 'vuex';

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
    ...mapGetters([
      'gameStage',
    ]),

    canCtrl() {
      return !this.player.isDealer && this.turn && this.gameStage === 3;
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
      return this.hands[0].revealed < 3;
    },

    canSplit() {
      const hand = this.hands[0];
      const cards = hand.cards;
      if (hand.revealed !== 2) return false;

      return cards[0].face === cards[1].face;
    },
  },
  methods: {

    // generic
    startTurn() {
      const stage = this.gameStage;
      if (!this.turn) return false;

      const actions = new Map([
        [1, this.dealOutFirst],
        [2, this.dealOutFirst],
        [3, this.playerActions],
        [4, this.dealOutLast],
        [5, this.getFinalScores],
      ]);

      if (actions.has(stage)) {
        return actions.get(stage)();
      }

      return false;
    },

    drawCard() {
      this.getActiveHand().cards.push({ face: 'x', score: 0, suit: 'blank' });

      return this;
    },

    revealCard(card = false) {
      // const newCard = card || this.shared.deck.deal();
      const newCard = this.$store.dispatch('deckDrawRandom');

      /*
      const activeHand = this.getActiveHand();
      if (activeHand.cards.length - 1 < activeHand.revealed) {
        this.drawCard();
      }
      setTimeout(() => {
        this.$set(activeHand.cards, activeHand.revealed, newCard);
        activeHand.revealed += 1;

        if (this.canCtrl) {
          this.$nextTick(() => {
            this.scoreCheck();
          });
        }
      }, 200);

      return this; */
    },

    getActiveHand() {
      return this.hands[this.activeHand];
    },

    nextHand() {
      if (this.hands.length - 1 === this.activeHand) {
        this.emitEndTurn();
      } else {
        this.activeHand += 1;
      }
    },

    emitEndTurn(delay = 0) {
      setTimeout(() => this.$store.dispatch('playerEndTurn'), delay);
      // setTimeout(() => this.$emit('end-turn'), delay);
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
      const isLastCard = this.player.isDealer && this.gameStage === 2;

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

      if (newCard.score > 0) {
        this.$nextTick(() => {
          this.emitFinalScore(21);
        });
      }

      return true;
    },

    // stage 3

    playerActions() {
      if (this.player.isDealer) {
        this.dealDealer();
      } else {
        this.scoreCheck();
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

    scoreCheck() {
      const hand = this.getActiveHand();
      const score = hand.score;

      console.log('checking score', hand.score);

      switch (true) {
      case score > 21:
        this.emitBidChange('lose');
        break;
      case score === 21 && hand.revealed === 2:
        this.emitBidChange('blackJack');
        break;
      case score === 21:
        this.nextHand();
        break;
      default:
        // score ok, carry on
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
      this.emitBidChange('doubleBet');
      const splitCard = this.getActiveHand().cards.splice(1)[0];
      this.getActiveHand().revealed = 1;

      this.revealCard();

      this.hands.push(this.setBlankCard());

      this.activeHand = 1;
      this.revealCard(splitCard);
      setTimeout(() => {
        this.revealCard();
        this.activeHand = 0;
      }, this.autoTime);
    },


    double() {
      this.emitBidChange('doubleBet').drawCard().emitEndTurn(this.autoTime);
    },

    surrender() {
      this.emitBidChange('forfeit');
    },

    emitBidChange(str) {
      this.$emit('bid-change', str);
      return this;
    },

    // stage 4

    dealOutLast() {
      const activeHand = this.getActiveHand();

      let delay = 0;

      if (activeHand.cards.length > activeHand.revealed) {
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
