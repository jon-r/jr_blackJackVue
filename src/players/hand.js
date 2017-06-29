// TODO: anyway to clean out some of this module? by far the biggest.
// maybe move some of the card functions or smt

import { mapGetters } from 'vuex';

import PlayerCards from './cards';

export default {
  props: ['turn', 'player', 'framepos'],
  template: `
  <div class="player-hand frame" >

    <player-cards
      v-for="(hand, idx) in hands"
      :key="idx"
      :framepos="framepos"
      :cards="hand.cards"
      v-model="hand.score" >
    </player-cards>

  </div>
  `,
  components: {
    'player-cards': PlayerCards,
  },
  data() {
    return {
      hands: [],
      activeHand: -1,
      messageAddon: '',
    };
  },
  computed: {

    getActiveHand() {
      const hand = this.hands[this.activeHand];
      return hand;
    },

    allowPlay() {
      if (!this.getActiveHand) return false;

      const hand = this.getActiveHand;
      const score = hand.score;
      const max = this.player.isDealer ? 17 : 21;
      let messageStr = '';

      if (score > 21) {
        messageStr = 'Bust!';
        this.emitBetChange('lose');
      } else if (score === 21 && hand.revealed === 2) {
        messageStr = 'BlackJack!';
        this.emitBetChange('blackJack');
      }

      this.cardMessage(hand, messageStr);
      return score < max;
    },

    ...mapGetters([
      'gameRound',
      'gameStage',
      'dealer',
      'autoTime',
      'eventBus',
      'eventID',
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
      hand.cards.push({ face: '', score: 0, suit: 'blank' });
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

    /* TURN 0 ------------------ */

    clearTable() {
      console.log('clearing table');
      this.hands.forEach((hand) => { hand.cards = []; });

      this.wait(this.autoTime).then(() => {
        this.hands = [];
        this.activeHand = -1;
      });

//      if (this.hands.length > 0) {
//        this.hands.forEach((hand) => { hand.cards = []; });
//      }
//
//      this.hands = [];
//
//      return this.wait(this.autoTime)
//        .then(() => this.addHand())
//        .then(() => { this.activeHand = 0; });
    },

    /* TURN 1 ------------------ */

    dealOutFirst() {
      this.activeHand = 0;
      console.log('first cards');
      this.addHand().wait(0)
        .then(() => this.dealRevealSet())
        .then(() => this.emitEndTurn());
    },

    /* TURN 2 ------------------ */

    dealOutSecond() {
      const isDealer = this.player.isDealer;
      this.dealRevealSet(isDealer)
      .then(() => {
        const endImmediately = (isDealer && this.getActiveHand.score === 21);

        return (endImmediately) ? this.emitEndRound() : this.emitEndTurn();
      });
    },

    /* TURN 3 -------------------- */

    updateRules(hand) {
      const count = hand.revealed;
      const split = (count === 2 && (hand.cards[0].face === hand.cards[1].face));
      this.$store.dispatch('handCtrlRules', { count, split });
      return this;
    },

    scoreCheck() {
      const hand = this.getActiveHand;

      this.updateRules(hand);
      if (!this.allowPlay) this.nextHand();
    },


    playerActions() {
      console.log('player turns');
      if (!this.player.isDealer) {
        return this.scoreCheck();
      }

      if (this.dealer.peeked) {
        return this.setCard(this.dealer.peeked).wait(0)
          .then(() => this.autoHit());
      }

      return this.fillBlanks().then(() => this.autoHit());
    },

    doCtrl() {
      const { idx, type, value } = this.eventBus;
      const isHandEvent = (idx === this.player.index) && (type === 'card');

      if (isHandEvent) this[value]();
    },

    hit() {
      this.dealRevealSet().then(() => this.scoreCheck());
    },

    autoHit() {
      if (this.allowPlay) {
        this.dealRevealSet()
          .then(() => this.wait(this.autoTime))
          .then(() => this.autoHit());
      } else {
        this.emitEndTurn();
      }
    },

    stand() {
      this.wait(0).then(() => this.nextHand());
    },

    split() {
      const hand = this.getActiveHand;
      const splitCard = hand.cards.splice(1)[0];
      hand.revealed -= 1;

      this.emitBetChange('addBet')
        .then(() => this.dealRevealSet())
        .then(() => this.addSplitHand(splitCard))
        .then(() => this.wait(0))
        .then(() => this.dealRevealSet())
        .then(() => this.prevHand().scoreCheck());
    },

    surrender() {
      this.emitBetChange('forfeit')
        .then(() => this.emitEndTurn());
    },

    double() {
      this.addBlankCard().emitBetChange('addBet')
        .then(() => this.emitEndTurn());
    },

    /* TURN 4 ------------------------- */

    dealOutLast() {
      console.log('dealing out last cards and setting score');
      this.fillBlanks()
        .then(() => this.setFinalScores().emitEndTurn());
    },

    setFinalScores() {
      // also filtering out any bust scores
      const bestScore = this.hands
        .map(hand => hand.score)
        .reduce((max, cur) => (cur > 21 ? max : Math.max(max, cur)), -1);

      this.emitFinalScore(bestScore);

      return this;
    },

    /* TURN 5 ----------------------------------------------------------- */

    // emit scores for end of round?

    /* emits -------------------------------------------------------------*/

    emitEndTurn() {
      this.$store.dispatch('nextPlayer');
    },

    emitEndRound() {
      this.$store.dispatch('setStage', 4);
    },

    emitBetChange(value) {
      const betEvent = {
        idx: this.player.index,
        type: 'bet',
        value,
      };

      return this.$store.dispatch('doEvent', betEvent);
    },

    emitFinalScore(value) {
      const idx = this.player.index;
      this.$store.dispatch('playerSetScore', { idx, value });
    },

    /* messenger ---------------------------------------------------------*/

    cardMessage(hand, outcome) {
      const player = this.player.name;
      const has = (hand.revealed === 2) ? 'starts with' : 'now has';
      const score = hand.score;

      const msg = `${player} ${has} ${score}. ${outcome}`;

      this.$store.dispatch('setNewMessage', msg);
    },

  },
  watch: {
    gameRound: 'clearTable',
    turn: 'startTurn',
    eventID: 'doCtrl',

  },
};
