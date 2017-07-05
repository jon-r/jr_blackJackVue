import { mapGetters } from 'vuex';
import { valueCard, blankCard } from '../deckTools';

import PlayerCards from './cards';

export default {
  props: ['turn', 'player', 'framepos', 'result'],
  template: `
  <div class="player-hand frame flex-auto flex flex-column" >

    <player-cards
      v-for="(hand, idx) in hands"
      :key="idx"
      :framepos="framepos"
      :cards="hand.cards"
      :active="idx === activeHand"
      v-model="hand.score" >
    </player-cards>
    <div class="round-alert alert-text" v-if="roundResult && !player.isDealer" >
      {{roundResult}}
    </div>

  </div>
  `,
  components: {
    'player-cards': PlayerCards,
  },
  data() {
    return {
      hands: [],
      activeHand: -1,
      message: '',
    };
  },
  computed: {

    getActiveHand() {
      return this.hands[this.activeHand];
    },

    allowPlay() {
      if (!this.getActiveHand) return false;

      const hand = this.getActiveHand;
      const score = hand.score;
      const max = this.player.isDealer ? 17 : 21;

      if (score > 21) {
        this.message = 'Bust!';
        this.emitBetChange('lose');
      } else if (score === 21 && hand.revealed === 2) {
        this.message = 'BlackJack!';
        this.emitBetChange('blackJack');
      }

      this.cardMessage(hand, this.message);
      return score < max;
    },

    roundResult() {
      return this.message || this.result || '';
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


    addBlankCard() {
      const hand = this.getActiveHand;
      hand.cards.push(blankCard);
      return this;
    },

    revealCard(mayPeek = false) {
      const drawType = mayPeek ? 'deckDrawPeek' : 'deckDrawRandom';

      return this.$store.dispatch(drawType, this.getActiveHand.score);
    },

    setCard(card, isPreset = false) {
      if (!card) return this;

      const newCard = isPreset ? card : valueCard(card);
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
 //       [5, this.roundResult],
      ]);

      const fn = actions.get(this.gameStage);

      return fn ? fn() : false;
    },

    /* TURN 0 ------------------ */

    clearTable() {
      this.hands.forEach((hand) => { hand.cards = []; });
      this.message = '';

      setTimeout(() => {
        this.hands = [];
        this.activeHand = -1;
      }, 2000);
    },

    /* TURN 1 ------------------ */

    dealOutFirst() {
      this.activeHand = 0;
      this.addHand().wait(100)
        .then(() => this.dealRevealSet())
        .then(() => this.emitEndTurn());
    },

    /* TURN 2 ------------------ */

    dealOutSecond() {
      const isDealer = this.player.isDealer;
      this.dealRevealSet(isDealer)
      .then(() => {
        const endImmediately = (isDealer && this.getActiveHand.score === 21);

        return (endImmediately)
          ? this.wait(this.autoTime).then(() => this.emitEndRound())
          : this.emitEndTurn();
      });
    },

    /* TURN 3 -------------------- */

    updateRules() {
      const hand = this.getActiveHand;
      const count = hand.revealed;
      const split = (count === 2 && (hand.cards[0].face === hand.cards[1].face));
      this.$store.dispatch('handCtrlRules', { count, split });
    },

    scoreCheck() {
      this.updateRules();
      if (!this.allowPlay) this.nextHand();
    },


    playerActions() {
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
        .then(() => this.wait(100))
        .then(() => this.dealRevealSet())
        .then(() => this.prevHand().scoreCheck());
    },

    surrender() {
      this.emitBetChange('forfeit')
        .then(() => this.emitEndTurn());
    },

    double() {
      this.addBlankCard().emitBetChange('addBet')
        .then(() => this.$store.dispatch('playerDoubleBet', { idx: this.player.index })) // needed to change the bet AFTER adding. to avoid double dipping
        .then(() => this.emitEndTurn());
    },

    /* TURN 4 ------------------------- */

    dealOutLast() {
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

    /* emits -------------------------------------------------------------*/

    emitEndTurn() {
      this.$store.dispatch('nextPlayer');
    },

    emitEndRound() {
      const store = this.$store;
      store.dispatch('setStage', 3);
      store.dispatch('nextPlayer');
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
      const has = (hand.revealed === 2) ? 'starts with' : 'now has';

      const msg = `${this.player.name} ${has} ${hand.score}. ${outcome}`;

      this.$store.dispatch('setNewMessage', msg);
    },

  },
  watch: {
    gameRound: 'clearTable',
    turn: 'startTurn',
    eventID: 'doCtrl',
  },
};
