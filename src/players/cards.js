import { mapGetters } from 'vuex';
import { runLerpLoop, transformJiggle, setStartFinish, setTarget } from '../animationTools';

export default {
  props: ['cards', 'framepos'],
  template: `
  <div class="player-cards" >
    <div class="hand-score shadow-light" :class="{ 'error-text': score > 21 }" >
      {{score}} {{scoreStr}}
    </div>

    <transition-group name="cards" tag="div"
      @before-enter="beforeEnter" @enter="enter" @leave="leave" >
      <div v-for="(card, idx) in this.cards"
        class="card-outer"
        :class="card.suit"
        :key="idx"
        :data-index="idx" >

        <div class="card shadow-light" :class="card.suit" >
          <span>{{card.face}}</span>
        </div>
      </div>
    </transition-group>

  </div>
  `,
  data() {
    return {
      aces: 0,
    };
  },
  computed: {
    enterPosition() {
      const shoe = this.shoePos;
      const frame = this.framepos;
      // todo: figure out why these magic numbers are needed

      return {
        x: shoe.x - frame.x - 5,
        y: shoe.y - frame.y - 70,
      };
    },

    leavePosition() {
      const frame = this.framepos;
      return {
        x: -frame.x,
        y: -(frame.y + 70),
      };
    },

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

    ...mapGetters([
      'shoePos',
    ]),
  },
  methods: {

    beforeEnter(el) {
      const offsetX = el.dataset.index * 30;

      setStartFinish(el, {
        start: this.enterPosition,
        finish: transformJiggle({ offsetX }),
      });
    },
    enter(el, done) {
      runLerpLoop(el, done, 200);
    },

    leave(el, done) {
      setTarget(el, this.leavePosition);
      runLerpLoop(el, done, 100);
    },
  },

};
