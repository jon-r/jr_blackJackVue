export default {
  template: `
  <div class="intro-form" >
    <form id="v-options" class="intro-form" @submit.prevent="setOptions" >

      <span >
        <label for="input-deck" >Decks</label>
        <input v-model.lazy="deckInput" type="text" id="input-deck" />
      </span>

      <span v-for="(player,idx) in playerInput" :key="idx" >
        <label :for="'input-' + idx" >Player {{idx}}:</label>
        <input v-model.lazy="player.name" type="text" :id="'input-' + idx" />
      </span>

      <input type="submit" val="Update" />

    </form>
    <button @click="skipBets" >Skip Bets</button>
  </div>
  `,

  data() {
    return {
      playerInput: [
        { name: 'Aaron' },
        { name: 'Beth' },
        { name: 'Chris' },
        { name: 'Denise' },
        { name: 'Ethan' },
      ],
      deckInput: 6,
    };
  },

  methods: {
    getOptions() {
      const players = this.playerInput.map((player, index) => ({
        index,
        name: player.name,
        score: 0,
        isDealer: false,
      }));

      const dealerIdx = players.length;

      players.push({
        index: dealerIdx,
        name: 'Dealer',
        score: 0,
        isDealer: true,
      });

      return {
        players,
        deckCount: this.deckInput,
      };
    },
    setOptions() {
      const options = this.getOptions();
      this.$emit('new-game', options);
    },
    skipBets() {
      const options = this.getOptions();
      this.$emit('new-game', options, true);
//       this.game.endTurn();
    },

  },
};
