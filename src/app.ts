import { defineComponent } from "vue";
// @ts-expect-error bad types
import { mapGetters } from "vuex";

import ActionsBar from "./components/actionsBar/ActionsBar.vue";
import OptionsModal from "./components/options/OptionsModal.vue";
// import CtrlFrame from "./ctrls/ctrl-frame.ts";
// import PlayerFrame from "./players/player-frame.ts";
// import SvgStatic from "./svg-static.ts";
import { AnyPlayer } from "./types/players.ts";
import { GameEvent } from "./types/state.ts";
import PlayerFrame from './components/playerFrame/PlayerFrame.vue'
import  SvgStatic from './components/SvgStatic.vue'
// import PlayerFrame from "./players/player-frame.ts";
// import SvgStatic from "./svg-static.ts";

export default defineComponent({
  template: `
      <div class="container flex flex-column">
          <button class="text-btn modal-toggle" @click="showOptions = true" >
            <i class="material-symbols-outlined">menu</i>
          </button>
        
        <OptionsModal v-if="showOptions" @close-modal="showOptions = false" />

          <main class="blackjack-table flex-auto" >
    
            <transition-group class="announcement frame" name="messages" tag="ul" >
              <li class="message" v-for="msg in messages" :key="msg.idx" >{{msg.text}}</li>
            </transition-group>
    
            <div v-once class="deck" ref="theShoe" >
              <div class="card blank stacked" ></div>
            </div>
    
            <PlayerFrame
                v-if="activePlayerCount > 0"
                v-for="player in players"
                :key="player.index"
                :player="player" />
            
    
          </main>

        <ActionsBar :player="activePlayer" />
    
          <SvgStatic v-once/>
      </div>
    `,

  components: {
    SvgStatic,
    PlayerFrame,

    ActionsBar,
    OptionsModal,

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
