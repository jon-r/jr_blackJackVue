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
      score: this.scoreCheck(this.cards),
    };
  },
  computed: {},
  methods: {

    setScore() {
      const revealedCards = this.cards.filter(card => card.face !== 'x');

      this.score = this.scoreCheck(revealedCards);
      this.$emit('score-update', this.score);
    },

    scoreCheck(cards) {
      if (cards.length === 0) return 0;

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

      const firstCards = cards.length < 3;

      if (newScore === 21 && firstCards) {
        this.scoreStr = 'BlackJack';
        return newScore;
      }

      const hasSoftAce = firstCards && cards.some(card => card.face === 'A');

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
        this.cards = [];
      }
    },
  },
  watch: {
    score: 'newGameReset',
    cards: 'setScore',
    // new: 'addCard',
  },
};
