import { defineComponent } from "vue";
// @ts-expect-error bad types
import { mapGetters } from "vuex";

import ActionsBar from "./components/actionsBar/ActionsBar.vue";
import CtrlFrame from "./ctrls/ctrl-frame.ts";
import OptionsModal from "./ctrls/options-ctrl.ts";
import PlayerFrame from "./players/player-frame.ts";
import SVGElements from "./svg-static.ts";
import { AnyPlayer } from "./types/players.ts";
import { GameEvent } from "./types/state.ts";

export default defineComponent({
  template: `
      <div class="container flex flex-column">
          <button class="text-btn modal-toggle" @click="showOptions = true" >
            <i class="material-symbols-outlined">menu</i>
          </button>
    
          <options-modal v-if="showOptions" @hide="showOptions = false" >
          </options-modal>
    
          <main class="blackjack-table flex-auto" >
    
            <transition-group class="announcement frame" name="messages" tag="ul" >
              <li class="message" v-for="msg in messages" :key="msg.idx" >{{msg.text}}</li>
            </transition-group>
    
            <div v-once class="deck" ref="theShoe" >
              <div class="card blank stacked" ></div>
            </div>
    
            <player-frame
                v-if="activePlayerCount > 0"
                v-for="player in players"
                :key="player.index"
                :player="player" >
            </player-frame>
    
          </main>
    
<!--          <ctrl-frame :player="activePlayer" ></ctrl-frame>-->
        <ActionsBar :player="activePlayer" />
    
          <svg-static v-once></svg-static>
      </div>
    `,

  components: {
    ActionsBar,
    "player-frame": PlayerFrame,
    "ctrl-frame": CtrlFrame,
    "svg-static": SVGElements,
    "options-modal": OptionsModal,
  },

  data() {
    return {
      showOptions: true,
      messages: [] as { text: string; idx: number }[],
      messageIdx: 0,
    };
  },

  // VUEX link to store
  // store,

  mounted() {
    const el = this.$refs.theShoe as HTMLElement;

    this.$store.dispatch("setShoePos", {
      x: el.offsetLeft,
      y: el.offsetTop,
    });
  },

  computed: {
    ...mapGetters([
      "players",
      "gameActivePlayer",
      "newMessage",
      "eventBus",
      "eventID",
      "activePlayerCount",
    ]),

    activePlayer() {
      return (this.players as AnyPlayer[])[this.gameActivePlayer as number];
    },
  },

  methods: {
    newGameCheck() {
      if ((this.eventBus as GameEvent).type === "newGame")
        this.showOptions = true;
    },

    updateChat(params: string) {
      const maxMessages = 5;

      this.messageIdx += 1;

      this.messages.unshift({
        text: params,
        idx: this.messageIdx,
      });

      if (this.messages.length > maxMessages) this.messages.pop();
    },
  },

  watch: {
    newMessage: "updateChat",
    eventID: "newGameCheck",
  },
});
