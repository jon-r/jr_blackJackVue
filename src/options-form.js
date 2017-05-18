import Vue from 'vue';
import game from './game-play';

export default {
  template: `
  <form id="v-options" class="intro-form" @submit.prevent="setOptions" >

    <span >
      <label for="deckInput" >Decks</label>
      <input v-model.lazy="deckInput" type="text" id="deckInput" />
    </span>

    <span v-for="(player,idx) in playerInput" :key="idx" >
      <label :for="player.label" >{{player.label}}</label>
      <input v-model.lazy="player.name" type="text" :id="player.label" />
    </span>

    <input type="submit" val="Update" />

    <button @click="skipBets" >Skip Bets</button>
  </form>`,

  data() {
    return { game };
  },
  computed: {
    deckInput() {
      return this.game.defaults.deckInput;
    },
    playerInput() {
      return this.game.defaults.playerInput;
    },
  },

  methods: {
    getOptions() {
      const playerNames = this.playerInput.map(player => player.name);
      playerNames.push('Dealer');

      return {
        players: playerNames,
        deckcount: this.deckInput,
      };
    },
    setOptions() {
      const options = this.getOptions();
      this.game.newGame(options);
    },
    skipBets() {
      const options = this.getOptions();
      this.game.newGame(options);
      Vue.nextTick(() => {
        this.game.endStage();
      });
//       this.game.endTurn();
    },

  },
};
