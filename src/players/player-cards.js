export default {
  props: ['cards'],
  template: `
  <div class="held-cards" >
    <div class="hand-score" >
      {{this.scoreStr}} {{this.score}}
    </div>

    <transition-group enter name="cards" tag="div" >
      <div v-for="(card, idx) in this.cards" :key="idx" class="card" :class="card.suit" >
        {{card.face}}
      </div>
    </transition-group>

  </div>
  `,
  data() {
    return { aces: 0 };
  },
  computed: {

    score() {
      const cards = this.cards;

      if (cards.length === 0) return 0;

      this.aces = cards.reduce((count, card) => count + (card.face === 'A'), 0);

      let newScore = cards.reduce((score, card) => score + card.score, 0);

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

      switch (true) {
      case (score > 21):
        return 'Bust';
      case (score === 21 && this.cards.length < 3):
        return 'BlackJack';
      case (this.aces > 0):
        return 'Soft';
      default:
        return '';
      }
    },
  },
};
