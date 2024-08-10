import { PropType, defineComponent } from "vue";
// @ts-expect-error bad types
import { mapGetters } from "vuex";

import { Player } from "../types/players.ts";
import BetCtrl from "./bet-ctrl.ts";
import EndGameCtrl from "./end-game-ctrl.ts";
import HandCtrl from "./hand-ctrl.ts";

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: false },
  },
  template: `
  <section class="ctrl-bar flex" >
    <template v-if="player" >
      <div class="player-info frame text-right flex-auto" >
        <h2>{{player.name}}</h2>
        <p>{{tips}}</p>
      </div>

      <bet-ctrl v-if="gameStage === 0" :player="player" ></bet-ctrl>

      <hand-ctrl v-else-if="gameStage === 3" :player="player" ></hand-ctrl>

      <end-game-ctrl v-else-if="gameStage > 4" :player="player" ></end-game-ctrl>

    </template>
  </section>`,

  components: {
    "hand-ctrl": HandCtrl,
    "bet-ctrl": BetCtrl,
    "end-game-ctrl": EndGameCtrl,
  },

  computed: {
    tips() {
      const player = this.player;
      const stage = this.gameStage as number;
      const out = new Map([
        [0, `Current money: £${player?.money}. Min Bet: £${this.minBet}.`],
        [5, "Round Over. Keep on playing?"],
        // todo bonus = more tips?
      ]);

      return out.has(stage) ? out.get(stage) : "";
    },

    ...mapGetters(["gameStage", "minBet"]),
  },

  methods: {
    // todo stage to enum
    postMessage(stage: number) {
      const out = new Map([
        [0, "Please place Your bets"],
        [1, "All bets are in, dealing out the first cards."],
        [5, "Round Over"],
      ]);

      if (!out.has(stage)) return false;

      const msg = out.get(stage);

      return this.$store.dispatch("setNewMessage", msg);
    },
  },
  watch: {
    gameStage: "postMessage",
  },
});
