import { mapGetters } from 'vuex';

import PlayerCards from './cards';

export default {
  props: ['turn', 'player'],
  template: `
  <div class="player-hand" >

    <player-cards
      v-for="(hand, idx) in hands"
      :key="idx"
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
      activeHand: 0,
    };
  },
  computed: {

    getActiveHand() {
      const hand = this.hands[this.activeHand];
      return hand;
    },

    willAct() {
      return this.turn && this.cardFn;
    },

    allowPlay() {
      if (!this.getActiveHand) return false;

      const isDealer = this.player.isDealer;
      const score = this.getActiveHand.score;
      const max = isDealer ? 17 : 21;

      if (score > 21) {
        this.emitBidChange('lose');
      } else if (score === 21 && this.getActiveHand.revealed === 2) {
        this.emitBidChange('blackJack');
      }

      return score < max;
    },

    ...mapGetters([
      'gameRound',
      'gameStage',
      'dealer',
      'autoTime',
      'cardFn',
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

      this.updateRules();

      return this;
    },

    updateRules() {
      const hand = this.getActiveHand;

      const count = hand.revealed;
      const split = (count === 2 && (hand.cards[0].face === hand.cards[1].face));
      this.$store.dispatch('handCtrlRules', { count, split });
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

    clearCards() {
      this.hands = [];
      this.activeHand = 0;
    },

    /* TURN 1 ------------------ */

    dealOutFirst() {
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
        if (endImmediately) {
          this.emitEndRound();
        } else {
          this.emitEndTurn();
        }
      });
    },

    /* TURN 3 -------------------- */

    scoreCheck() {
      if (!this.allowPlay) this.nextHand();
    },


    playerActions() {
      if (!this.player.isDealer) {
        return this.scoreCheck();
      }

      if (this.dealer.peeked) {
        return this.setCard(this.dealer.peeked).autoHit();
      }

      return this.fillBlanks().then(() => this.autoHit());
    },

    doCtrl(ctrl) {
      if (!this.willAct) return false;

      return this[ctrl]();
    },

    hit() {
      this.dealRevealSet().then(() => this.scoreCheck());
    },

    autoHit() {
      return this.allowPlay ? this.dealRevealSet().then(() => this.autoHit()) : this.emitEndTurn();
    },

    stand() {
      this.wait(0).then(() => this.nextHand());
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
      this.emitBidChange('forfeit').wait(0)
        .then(() => this.emitEndTurn());
    },

    double() {
      this.emitBidChange('addBet').addBlankCard().wait(0)
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

    /* emits -------------*/

    emitEndTurn() {
      this.$store.dispatch('nextPlayer');
    },

    emitEndRound() {
      this.$store.dispatch('setStage', 4);
    },

    emitBidChange(event) {
      this.$store.dispatch('betFn', event);
      return this;
    },

    emitFinalScore(score) {
      const player = this.player;
      this.$store.dispatch('playerSetScore', { player, score });
    },

  },
  watch: {
    gameRound: 'clearCards',
    turn: 'startTurn',
    cardFn: 'doCtrl',
  },
};
