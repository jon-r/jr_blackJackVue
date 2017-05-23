export default {
  props: ['cards'],
  template: `
  <div class="held-cards" >
    <div v-for="card in this.cards" class="card" :class="card.suit" >
      {{card.face}}
    </div>
    <div class="hand-score" >
      {{this.scoreStr}} {{this.score}}
    </div>
  </div>
  `,
  data() {
    return { aces: 0 };
  },
  computed: {
    score() {
      const revealedCards = this.cards.filter(card => card.face !== 'x');

      if (revealedCards.length === 0) return 0;

      this.aces = revealedCards.reduce((count, card) => count + (card.face === 'A'), 0);

      let newScore = revealedCards.reduce((score, card) => score + card.score, 0);

      // reduces as many aces as needed (if possible) to keep the score down
      while (newScore > 21 && this.aces > 0) {
        this.aces -= 1;
        newScore -= 10;
      }
      this.$emit('input', newScore);
      return newScore;
    },

    scoreStr() {
      const score = this.score;

      if (score > 21) return 'Bust';

      if (score === 21 && this.cards.length < 3) return 'BlackJack';

      if (this.aces > 0) return 'Soft';

      return '';
    },
  },
  methods: {

  },
  watch: {

  },
};
