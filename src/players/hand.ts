// @ts-expect-error - bad types
import { mapGetters } from 'vuex';
import { valueCard, blankCard } from '../deckTools.ts';

import PlayerCards from './cards.ts';
import {defineComponent, PropType} from "vue";
import {Position} from "../types/animations.ts";
import {Dealer, Player} from "../types/players.ts";
import {Card, PlayerHand, RawCard} from "../types/card.ts";
import {GameEvent} from "../types/state.ts";

export default defineComponent({
  props: {
    'turn': {type: Number, required: true},
    'player': {type: Object as PropType<Player>, required: true},
    'framepos': {type: Object as PropType<Position>, required: true},
    'result': {type: Number, required: true}
  },
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
      hands: [] as PlayerHand[],
      activeHand: -1,
      message: '',
    };
  },
  computed: {

    getActiveHand(): PlayerHand | undefined {
      return this.hands[this.activeHand];
    },

    allowPlay() {
      if (!this.getActiveHand) return false;

      const hand = this.getActiveHand as PlayerHand;
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

    wait<T>(time: number, resolved: T): Promise<T> {
      return new Promise(resolve =>
        setTimeout(() => resolve(resolved), time),
      );
    },

    /* hand methods */
    addHand() {
      this.hands.push({ cards: [], score: 0, revealed: 0 });
      return this;
    },

    addSplitHand(splitCard: Card) {
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
      const hand = this.getActiveHand as PlayerHand;
      hand.cards.push(blankCard);
      return this;
    },

    revealCard(mayPeek = false): Promise<RawCard> {
      const drawType = mayPeek ? 'deckDrawPeek' : 'deckDrawRandom';

      return this.$store.dispatch(drawType, (this.getActiveHand as PlayerHand).score);
    },

    setCard(card: RawCard | Card, isPreset = false) {
      if (!card) return this;

      const newCard = isPreset ? card : valueCard(card as RawCard);
      const activeHand = this.getActiveHand as PlayerHand;

      // fixme this looks sus
      activeHand.cards.splice(activeHand.revealed, 1, newCard as Card)

      activeHand.revealed += 1;

      return this;
    },

    dealRevealSet(mayPeek = false) {
      return this.addBlankCard().revealCard(mayPeek)
        .then(rawCard => this.wait(this.autoTime as number, rawCard))
        .then(rawCard => this.setCard(rawCard));
    },

    fillBlanks() {
      const activeHand = this.getActiveHand as PlayerHand;
      const hasBlank = (activeHand.cards.length > activeHand.revealed);

      if (!hasBlank) return Promise.resolve();

      return this.revealCard()
        .then(rawCard => this.wait(this.autoTime as number, rawCard))
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

      const fn = actions.get(this.gameStage as number);

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
      this.addHand().wait(100, null)
        .then(() => this.dealRevealSet())
        .then(() => this.emitEndTurn());
    },

    /* TURN 2 ------------------ */

    dealOutSecond() {
      const isDealer = this.player.isDealer;
      this.dealRevealSet(isDealer)
      .then(() => {
        const endImmediately = (isDealer && (this.getActiveHand as PlayerHand).score === 21);

        return (endImmediately)
          ? this.wait(this.autoTime as number, null).then(() => this.emitEndRound())
          : this.emitEndTurn();
      });
    },

    /* TURN 3 -------------------- */

    updateRules() {
      const hand = this.getActiveHand as PlayerHand;
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

      const peekedCard = (this.dealer as Dealer).peeked
      if (peekedCard) {
        return this.setCard(peekedCard).wait(0, null)
          .then(() => this.autoHit());
      }

      return this.fillBlanks().then(() => this.autoHit());
    },

    doCtrl() {
      const { idx, type, value } = this.eventBus as GameEvent;
      const isHandEvent = (idx === this.player.index) && (type === 'card');

      // @ts-expect-error - do this better
      if (isHandEvent) this[value]();
    },

    hit() {
      this.dealRevealSet().then(() => this.scoreCheck());
    },

    autoHit() {
      if (this.allowPlay) {
        this.dealRevealSet()
          .then(() => this.wait(this.autoTime as number, null))
          .then(() => this.autoHit());
      } else {
        this.emitEndTurn();
      }
    },

    stand() {
      this.wait(0, null).then(() => this.nextHand());
    },

    split() {
      const hand = this.getActiveHand as PlayerHand;
      const splitCard = hand.cards.splice(1)[0];
      hand.revealed -= 1;

      this.emitBetChange('addBet')
        .then(() => this.dealRevealSet())
        .then(() => this.addSplitHand(splitCard))
        .then(() => this.wait(100, null))
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

    emitBetChange(value: string) {
      const betEvent = {
        idx: this.player.index,
        type: 'bet',
        value,
      };

      return this.$store.dispatch('doEvent', betEvent);
    },

    emitFinalScore(value: number) {
      const idx = this.player.index;
      this.$store.dispatch('playerSetScore', { idx, value });
    },

    /* messenger ---------------------------------------------------------*/

    cardMessage(hand: PlayerHand, outcome: string) {
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
});
