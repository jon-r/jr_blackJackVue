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
    setNewPlayer(name, index, isDealer = false) {
      return {
        index,
        name,
        isDealer,
        bid: 0,
        score: 0,
      };
    },
    getOptions() {
      const players = this.playerInput
        .map((player, index) => this.setNewPlayer(player.name, index));

      const dealer = this.setNewPlayer('Dealer', players.length, true);

      players.push(dealer);
      this.$store.dispatch('setPlayers', players);

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
      this.$emit('new-game', options);
      this.$store.dispatch('nextPlayer')
        .then(() => this.$store.dispatch('nextStage'));
//       this.game.endTurn();
    },

  },
};
