import { PropType, defineComponent } from "vue";
import { mapGetters } from "vuex";

import { Player } from "../types/players.ts";
import button from "./button.ts";

export default defineComponent({
  components: {
    "button-ctrl": button,
  },
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  template: `
  <div class="ctrl-menu frame-thick flex flex-wrap" >
    <button-ctrl
      v-for="(ctrl,j) in ctrls"
      :key="j" :ctrl="ctrl"
      @click="setTurn(ctrl.name)" >
    </button-ctrl>
  </div>
  `,

  computed: {
    ctrls() {
      const hasPlayers = (this.activePlayerCount as number) > 0;

      return [
        { name: "new game", canUse: true, icon: "skip_previous" },
        { name: "next round", canUse: hasPlayers, icon: "skip_next" },
      ];
    },

    ...mapGetters(["activePlayerCount"]),
  },
  methods: {
    setTurn(turn: string) {
      const store = this.$store;

      if (turn === "next round") {
        return store.dispatch("nextRound");
      }

      const gameEvent = { type: "newGame" };
      return store.dispatch("doEvent", gameEvent);
    },
  },
});
