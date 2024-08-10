import { PropType, defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setPos, transformJiggle } from "../animationTools.ts";
import { Position } from "../types/animations.ts";
import { Card } from "../types/card.ts";

export default defineComponent({
  props: {
    cards: { type: Object as PropType<Card[]>, required: true },
    framepos: { type: Object as PropType<Position>, required: true },
    active: { type: Boolean, required: true },
  },
  template: `
  <div class="player-cards" :class="{ 'active-hand': active }" >
    <div class="hand-score shadow-light" :class="{ 'error-text': score > 21}" >
      {{score}} {{scoreStr}}
    </div>

    <transition-group appear name="cards" tag="div"
      @enter="enter" @after-enter="enterTo" @leave="leave" >
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
  emits: ["update:modelValue"],
  computed: {
    enterPosition(): Position {
      const shoe = this.shoePos as Position;
      const frame = this.framepos;

      return {
        x: shoe.x - frame.x - 36,
        y: shoe.y - frame.y - 70,
      };
    },

    leavePosition(): Position {
      const frame = this.framepos;
      return {
        x: -frame.x,
        y: -frame.y - 100, // to go right off the page
      };
    },

    // fixme bug if 10 or face on soft (it doesnt update the score)
    // also remove the aces side-effect
    score() {
      const cards = this.cards;

      if (cards.length === 0) return 0;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.aces = cards.reduce(
        (count, card) => count + Number(card.face === "A"),
        0,
      );

      let newScore = cards.reduce((score, card) => score + card.score, 0);

      // reduces as many aces as needed (if possible) to keep the score down
      while (newScore > 21 && this.aces > 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.aces -= 1;
        newScore -= 10;
      }
      this.$emit("update:modelValue", newScore);

      return newScore;
    },

    scoreStr() {
      const score = this.score as number;

      switch (true) {
        case score > 21:
          return "Bust";
        case score === 21 && this.cards.length < 3:
          return "BlackJack";
        case this.aces > 0:
          return "Soft";
        default:
          return "";
      }
    },

    ...mapGetters(["shoePos"]),
  },
  methods: {
    // fixme card transitions seem to be problematic. maybe can be handled with just css?
    enter(el: HTMLElement) {
      setPos(el, this.enterPosition as Position);
    },
    enterTo(el: HTMLElement) {
      const offsetX = Number(el.dataset.index) * 30;
      const jiggle = transformJiggle({ offsetX });
      setPos(el, jiggle);
    },

    leave(el: HTMLElement, done: () => void) {
      setPos(el, this.leavePosition as Position);

      el.addEventListener("transitionend", done);
    },
  },
});
