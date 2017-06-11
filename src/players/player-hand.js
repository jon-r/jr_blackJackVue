/* TODO: the cards need to update when a card is revealed. NOT when the card is dealt
  1) reset the reveal timout (it was working)
  2) set to be a pinging new card (see the money change ping/reset)
  3) since pinging new card, screokeeping can be optimised to only add a new card?
  4) also perhaps this ping change could be used elsewhere to (eg new round/game);
*/

import { mapGetters } from 'vuex';

import PlayerCards from './player-cards';

export default {
  props: ['turn', 'player', 'action'],
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
      hands: [],
      activeHand: 0,
      autoTime: 100,
    };
  },
  computed: {
    getActiveHand() {
      return this.hands[this.activeHand];
    },

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
      if (hand.revealed !== 2) return false;

      const cards = hand.cards;
      return cards[0].face === cards[1].face;
    },

    ...mapGetters([
      'gameRound',
      'gameStage',
    ]),
  },
  methods: {

    wait(time, resolved = null) {
      return new Promise(resolve =>
        setTimeout(() => resolve(resolved), time),
      );
    },


    /* hand methods */
    addHand() {
      this.hands.push({ cards: [], score: 0, revealed: 0 });
      return this;
    },

    addSplitHand(splitCard) {
      this.addHand().nextHand().setCard(splitCard, true);
      return this;
    },

    nextHand() {
      if (this.hands.length - 1 === this.activeHand) {
        this.emitEndTurn();
      } else {
        this.activeHand += 1;
      }
      return this;
    },

    prevHand() {
      this.activeHand -= 1;
      return this;
    },


    /* card methods */

    valueCard(cardRaw) {
      const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
      const faces = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
      const value = cardRaw[0];
      const suit = cardRaw[1];

      return {
        face: (value in faces) ? faces[value] : value,
        score: value === 1 ? 11 : Math.min(10, value),
        suit: suits[suit],
      };
    },

    addBlankCard() {
      const hand = this.getActiveHand;
      hand.cards.push({ face: 'x', score: 0, suit: 'blank' });
      return this;
    },

    revealCard(mayPeek = false) {
      const drawType = mayPeek ? 'deckDrawPeek' : 'deckDrawRandom';

      return this.$store.dispatch(drawType, this.getActiveHand.score);
    },

    setCard(card, isPreset = false) {
      if (!card) return this;

      const newCard = isPreset ? card : this.valueCard(card);
      const activeHand = this.getActiveHand;

      this.$set(activeHand.cards, activeHand.revealed, newCard);
      activeHand.revealed += 1;

      return this;
    },

    dealRevealSet(mayPeek = false) {
      return this.addBlankCard().revealCard(mayPeek)
        .then(rawCard => this.wait(this.autoTime, rawCard))
        .then(rawCard => this.setCard(rawCard));
    },

    fillBlanks() {
      const activeHand = this.getActiveHand;
      const hasBlank = (activeHand.cards.length > activeHand.revealed);

      if (!hasBlank) return Promise.resolve();

      return this.revealCard()
        .then(rawCard => this.wait(this.autoTime, rawCard))
        .then(rawCard => this.setCard(rawCard));
    },

    scoreCheck() {
      const score = this.getActiveHand.score;

      console.log('checking score', score);

      switch (true) {
      case score > 21:
        return this.emitBidChange('lose').nextHand();
      case score === 21 && this.getActiveHand.revealed === 2:
        return this.emitBidChange('blackJack').nextHand();
      case score === 21:
        return this.nextHand();
      default:
        return this;
        // score ok, carry on
      }
    },

    /* turn setting -------------- */
    startTurn() {
      if (!this.turn) return false;

      const actions = new Map([
        [1, this.dealOutFirst],
        [2, this.dealOutSecond],
        [3, this.playerActions],
        [4, this.dealOutLast],
      ]);

      const fn = actions.get(this.gameStage);

      return fn ? fn() : false;
    },

    /* TURN 1 ------------------ */

    dealOutFirst() {
      this.addHand().wait(0)
        .then(() => this.dealRevealSet())
        .then(() => this.nextHand());
    },

    /* TURN 2 ------------------ */

    dealOutSecond() {
      this.dealRevealSet(this.player.isDealer)
        .then(() => this.nextHand());
    },

    /* TURN 3 -------------------- */

    playerActions() {
      if (!this.player.isDealer) {
        return this.scoreCheck();
      }

      const peeked = this.$store.getters.dealerPeek;
      if (peeked) {
        return this.setCard(peeked).autoHit();
      }

      return this.fillBlanks().then(() => this.autoHit());
    },

    hit() {
      this.dealRevealSet().then(() => this.scoreCheck());
    },

    autoHit() {
      if (this.getActiveHand.score > 16) {
        return this.emitEndTurn();
      }

      return this.dealRevealSet()
        .then(() => this.autoHit());
    },

    stand() {
      this.nextHand();
    },

    split() {
      const hand = this.getActiveHand;
      const splitCard = hand.cards.splice(1)[0];
      hand.revealed -= 1;

      this.emitBidChange('addBet').dealRevealSet()
        .then(() => this.addSplitHand(splitCard))
        .then(() => this.wait(0))
        .then(() => this.dealRevealSet())
        .then(() => this.prevHand().scoreCheck());
    },

    surrender() {
      this.emitBidChange('forfeit').emitEndTurn();
    },

    double() {
      this.emitBidChange('addBet').addBlankCard().emitEndTurn();
    },

    /* TURN 4 ------------------------- */

    dealOutLast() {
      this.fillBlanks()
        .then(() => this.setFinalScores().emitEndTurn());
    },

    setFinalScores() {
      const hands = this.hands;
      // also filtering out any bust scores
      const bestScore = this.hands
        .map(hand => hand.score)
        .reduce((max, cur) => (cur > 21 ? max : Math.max(max, cur)), -Infinity);

      this.emitFinalScore(bestScore);

      return this;
    },

    /* emits -------------*/

    emitEndTurn() {
      setTimeout(() => this.$store.dispatch('playerEndTurn'), this.autoTime);
    },

    emitBidChange(event) {
      const player = this.player;
      this.$store.dispatch('playerBidEvent', { player, event });
      return this;
    },

    emitFinalScore(score) {
      const player = this.player;
      this.$store.dispatch('playerSetScore', { player, score });
    },

  },
  watch: {
    gameRound: 'setGame',
    turn: 'startTurn',
  },
};
