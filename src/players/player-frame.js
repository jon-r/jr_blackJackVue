// import Vue from 'vue';
import { mapGetters } from 'vuex';

import PlayerHand from './player-hand';
import PlayerBet from './player-bet';

export default {
  props: ['player'],
  template: `
  <section class="player-frame" :class="playerClass" >

    <h3 class="player-name" :class="{active: isPlayerTurn}" >{{player.name}}</h3>

    <player-hand
      :player="player"
      :turn="isPlayerTurn" >
    </player-hand>


    <player-bet
      v-if="!player.isDealer"
      :player="player"
      :turn="isPlayerTurn" >
    </player-bet>

  </section>`,
  components: {
    'player-hand': PlayerHand,
    'player-bet': PlayerBet,
  },
  data() {
    return {
      playerClass: `player-${this.player.index}`,
      skip: false,
    };
  },

  computed: {
    ...mapGetters([
      'gameActivePlayer',
      'dealerScore',
      'gameStage',
    ]),

    isPlayerTurn() {
      return this.gameActivePlayer === this.player.index;
    },
  },

  methods: {

    turnCheck() {
      if (this.gameStage === 0 && this.player.isDealer && this.isPlayerTurn) {
        this.emitEndTurn();
      }
    },

    emitEndTurn() {
      this.$store.dispatch('playerEndTurn');
    },

    endRound() {
      const dealerScore = this.dealerScore;
      if (dealerScore === 0 || this.wins === 0) return false;

      const result = this.getScores(this.player.score, dealerScore);

      this.emitBidChange(result);

      return true;
    },
    emitBidChange(event) {
      const player = this.player;
      this.$store.dispatch('playerBidEvent', { player, event });
    },

    getScores(playerScore, dealerScore) {
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
  },
  watch: {
    dealerScore: 'endRound',
    isPlayerTurn: 'turnCheck',
  },
};
