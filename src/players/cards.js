function transformJiggle({
  scale = 10,
  offsetX = 0,
  offsetY = 0,
}) {
  const [nudgeX, nudgeY, rotate] = [0, 0, 0]
    .map(() => (Math.random() - 0.5) * scale);

  return `translate(${nudgeX + offsetX}px,${nudgeY + offsetY}px) rotate(${rotate}deg)`;
}

export default {
  props: ['cards'],
  template: `
  <div class="held-cards" >
    <div class="hand-score" >
      {{this.scoreStr}} {{this.score}}
    </div>

    <transition-group enter name="cards" tag="div" >
      <div v-for="(card, idx) in this.cards"
        class="card-outer"
        :key="idx" v-position="idx" >

        <div class="card" :class="card.suit" >
          <span>{{card.face}}</span>
        </div>
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
  directives: {
    position: {
      bind(el, binding, vnode) {
        const offsetX = binding.value * 30;
        el.style.transform = transformJiggle({ offsetX });
      },
    },
  },
};
