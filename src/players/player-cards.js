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
    return {
      hardAce: true,
      scoreStr: '',
    };
  },
  computed: {
    score() {
      if (!this.cards.length) {
        return 0;
      }
      const score = this.setScore(this.cards);
      this.$emit('score-update', score);
      return score;
    },

  },
  methods: {
    setScore(cards) {
      const firstCards = cards.length < 3;
      const hasSoftAce = firstCards && cards.some(card => card.face === 'A');

      const newScore = cards.reduce((score, card) => score + card.score, 0);

      if (newScore > 21 && this.hardAce) {
        this.scoreStr = 'Bust';
        return newScore;
      }

      if (newScore > 21 && !this.hardAce) {
        this.hardAce = true;
        this.scoreStr = '';
        const aceFix = newScore - 10;

        return aceFix;
      }

      if (newScore === 21 && firstCards) {
        this.scoreStr = 'BlackJack';
        return newScore;
      }

      if (newScore < 21 && hasSoftAce) {
        this.hardAce = false;
        this.scoreStr = 'Soft';
      }
      return newScore;
    },
    newGameReset() {
      if (this.score === 0) {
        this.scoreStr = '';
        this.hardAce = true;
      }
    },
  },
  watch: {
    score: 'newGameReset',
  },
};
