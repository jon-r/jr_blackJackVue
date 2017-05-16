

export default {
  props: { cards: Array, value: Number, game: Object },
  template: `
  <div class="held-cards" >
    <div v-for="card in this.cards" class="card" :class="card.suit" >
      {{card.face}}
    </div>

    <div class="hand-score" >
      <span>{{this.scoreStr}} {{this.score}}</span>
    </div>
  </div>
  `,
  data() {
    return {
      scoreStr: '',
      hardAce: true,
      score: 0,
    };
  },
  methods: {
    updateCards() {
      const cards = this.cards;
      const firstCards = cards.length < 3;
      const hasSoftAce = firstCards && cards.some(card => card.face === 'A');

      const newScore = this.score + this.value;

      this.score = newScore;

      if (newScore > 21 && this.hardAce) {
        this.scoreStr = 'Bust';
        this.skip = true;
        return this.cardResult(true);
      }

      if (newScore === 21 && firstCards) {
        this.scoreStr = 'BlackJack';
        return this.cardResult();
      }

      if (newScore > 21 && !this.hardAce) {
        this.hardAce = true;
        this.score -= 10;
        this.scoreStr = '';
        return this.cardResult();
      }

      if (newScore < 21 && hasSoftAce) {
        this.hardAce = false;
        this.scoreStr = 'Soft';
        return this.cardResult();
      }

      return this.cardResult();
    },
    cardResult(end = false) {
      this.$emit('cardResult', this.score, end);
    },
    newRoundReset() {
      if (this.game.roundStage === 0) {
        this.scoreStr = '';
        this.hardAce = true;
        this.score = 0;
      }
    },
  },
  watch: {
    cards: 'updateCards',
    'game.roundStage': 'newRoundReset',
  },
};
