// import Vue from 'vue';
import { mapGetters } from 'vuex';

import PlayerHand from './hand';
import PlayerBet from './bet';

export default {
  props: ['player'],
  template: `
  <section class="player-frame" :class="playerClass" ref="frameParent" >
    <player-hand
      :player="player"
      :framepos="framepos"
      :turn="isPlayerTurn" >
    </player-hand>

    <player-bet
      v-if="!player.isDealer"
      :player="player"
      :framepos="framepos"
      :turn="isPlayerTurn" >
    </player-bet>

    <header class="player-frame-title frame shadow-light" v-if="!player.isDealer" :class="{ 'is-active' : isPlayerTurn  }" >
      <h4 class="player-name" :class="{ 'alert-text': isPlayerTurn, 'error-text': isPlayerInactive }" >{{player.name}}</h4>

      <h5 class="player-money" >
        £{{player.money}}
        <span :class="[ diffClass, {'diff-float': diffFloat}]" >
          £{{moneyDiff}}
        </span>
      </h5>
    </header>

  </section>`,
  components: {
    'player-hand': PlayerHand,
    'player-bet': PlayerBet,
  },
  data() {
    return {
      playerClass: `player-${this.player.index}`,
      skip: false,
      oldMoney: 0,
      diffFloat: true,
      framepos: {},
    };
  },

  mounted() {
    const el = this.$refs.frameParent;

    this.framepos = {
      x: el.offsetLeft,
      y: el.offsetTop,
    };
  },

  computed: {

    diffClass() {
      this.triggerTextAnim();
      return (this.moneyDiff > 0) ? 'good-text' : 'error-text';
    },

    moneyDiff() {
      const out = this.player.money - this.oldMoney;
      this.oldMoney = this.player.money;
      return out;
    },

    isPlayerTurn() {
      return this.gameActivePlayer === this.player.index;
    },

    isPlayerInactive() {
      return !this.player.inGame;
    },

    ...mapGetters([
      'gameActivePlayer',
      'dealer',
      'gameStage',
      'minBet',
    ]),
  },

  methods: {

    turnCheck() {
      const cantBet = !this.player.inGame;
      const wontBet = this.gameStage === 0 && this.player.isDealer;

      if (this.isPlayerTurn && (cantBet || wontBet)) {
        this.$store.dispatch('nextPlayer');
      }
    },

    endRound() {
      const dealerScore = this.dealer.score;
      if (dealerScore === 0) return false;

      const result = this.getScores(dealerScore);

      return this.emitBetChange(result);
    },

    emitBetChange(value) {
      const betEvent = {
        idx: this.player.index,
        type: 'bet',
        value,
      };

      this.$store.dispatch('doEvent', betEvent);
    },

    getScores(dealerScore) {
      const playerScore = this.player.score;

      switch (true) {
      case dealerScore === playerScore:
        return 'push';
      case playerScore > 21 || dealerScore === 21:
        return 'lose';
      case dealerScore > 21 || playerScore > dealerScore:
        return 'win';
      default: // dealerScore > playerScore
        return 'lose';
      }
    },

    triggerTextAnim() {
      this.diffFloat = false;
      this.$nextTick(() => {
        this.diffFloat = true;
      });
    },
  },
  watch: {
    'dealer.score': 'endRound', // todo set this and any similar from game round?
    isPlayerTurn: 'turnCheck',
  },
};
