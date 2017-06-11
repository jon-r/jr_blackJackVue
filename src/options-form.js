export default {
  template: `
  <div class="intro-form" >
    <form id="v-options" class="intro-form" @submit.prevent="setOptions" >

      <div class="options-group" >
        <label for="input-deck" >Decks</label>
        <input v-model.lazy="deckInput" type="number" id="input-deck" />
      </div>

      <div class="options-group" >
        <label for="input-bid" >Min Bid</label>
        <input v-model.lazy="minBid" type="number" min="0" id="input-deck" />
      </div>

      <div class="options-group" v-for="(player,idx) in playerInput" :key="idx" >
        <label :for="'input-' + idx" >Player {{idx}}:</label>
        <input v-model.lazy="player.name" type="text" :id="'input-' + idx" />
      </div>

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
      minBid: 100,
    };
  },

  methods: {
    setNewPlayer(name, index, isDealer = false) {
      return {
        index,
        name,
        isDealer,
        money: 1000,
        bidEvent: '',
        score: 0,
      };
    },
    getOptions() {
      const minBid = this.minBid;
      const deckCount = this.deckInput;
      const players = this.playerInput
        .map((player, index) => this.setNewPlayer(player.name, index));

      const dealer = this.setNewPlayer('Dealer', players.length, true);

      players.push(dealer);

      return { players, deckCount, minBid };
    },
    setOptions() {
      const options = this.getOptions();
      this.$store.dispatch('newGame', options);
    },
    skipBets() {
      const options = this.getOptions();
      this.$store.dispatch('newGame', options);

      this.$store.dispatch('nextPlayerPromise')
        .then(() => this.$store.dispatch('nextStage'));
    },

  },
};
