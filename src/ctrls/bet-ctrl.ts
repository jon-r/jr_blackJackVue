import { PropType, defineComponent } from "vue";
// @ts-expect-error - bad types
import { mapGetters } from "vuex";

import { Player } from "../types/players.ts";
import ButtonBase from "./ButtonBase.vue";
import ButtonCtrl from "./button.ts";
import {ButtonControl} from "../types/button.ts";

export default defineComponent({
  components: {
    ButtonBase,
    "button-ctrl": ButtonCtrl,
  },
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  template: `
  <div class="ctrl-menu frame flex flex-wrap" >

    <ButtonBase
      v-for="ctrl in ctrlBets"
      :key="ctrl.label"
      :can-use="ctrl.canUse"
      :label="ctrl.label"
      :svg="ctrl.svg"
      :class-name="ctrl.className"
      
      @click="ctrl.onClick" >
    </ButtonBase>

    <ButtonBase
      v-for="ctrl in ctrlSubmits"
      :key="ctrl.icon"
      :can-use="ctrl.canUse"
      :label="ctrl.label"
      :icon="ctrl.icon"
      :class-name="ctrl.className"
      
      @click="ctrl.onClick" >
    </ButtonBase>

  </div>
  `,
  data() {
    return {
      chips: [5, 10, 25, 100, 500, 1000],
      currChips: [] as number[],
      currChipValue: 0,
    };
  },
  computed: {
    ctrlBets() {
      const maxChips = this.player.money - this.currChipValue;

      return this.chips.map((chip): ButtonControl => {
        const canUse = chip <= maxChips;
        return {
          label: `£${chip}`,
          className: `betting-chip chip-${chip}`,
          svg: "#chip",
          canUse,
          onClick: () => this.addChip(chip),
        };
      });
    },

    ctrlSubmits(): ButtonControl[] {
      const bet = this.currChipValue;

      return [
        {
          label: `Submit: £${bet}`,
          className: "btn-good",
          icon: "publish",
          canUse: bet >= (this.minBet as number),
          onClick: this.emitBet,
          alert:  `Min: £${this.minBet}`,
        },
        {
          label: "Undo",
          className: "btn-alert",
          icon: "undo",
          canUse: bet > 0,
          onClick: this.removeChip,
        },
      ];
    },

    ...mapGetters(["minBet"]),
  },
  methods: {
    addChip(chip: number) {
      this.currChipValue += chip;
      this.currChips.push(chip);
    },

    removeChip() {
      const chip = this.currChips.pop();
      this.currChipValue -= chip || 0;
    },

    emitBet() {
      const player = this.player;
      const idx = player.index;
      const bet = this.currChipValue;
      const store = this.$store;

      const betVals = {
        idx,
        value: bet,
      };
      const betEvent = {
        idx,
        type: "bet",
        value: "addBet",
      };

      this.currChips = [];
      this.currChipValue = 0;

      // todo bonus combine these in store?
      store.dispatch("setNewMessage", `${player.name} bets £${bet}`);

      store
        .dispatch("playerSetBet", betVals)
        .then(() => store.dispatch("doEvent", betEvent))
        .then(() => store.dispatch("nextPlayer"));
    },
  },
});
