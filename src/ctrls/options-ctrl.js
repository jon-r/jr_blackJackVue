export default {
  template: `
  <div class="options-outer center-content" >
    <div class="options-inner" >
      <button class="btn menu-toggle material-icons" @click="emitCloseOptions" >close</button>
      <form id="v-options" class="options-form" @submit.prevent="setOptions" >
        <fieldset class="options-group" >
          <h4 class="options-title" >Player Names</h4>
          <input v-for="(player,idx) in playerInput" :key="idx" v-model.lazy="player.name" type="text" :id="'input-' + idx" />
        </fieldset>

        <fieldset class="options-group" >
        <template v-if="moreOptions" >
          <h4  class="options-title" @click="moreOptions = false" >Less Options <i class="material-icons">expand_less</i></h4>

          <label>Decks</label>
          <input v-model.lazy="deckInput" type="number" id="input-deck" />

          <label>Min Bet</label>
          <input v-model.lazy="minBet" type="number" min="0" id="input-deck" />

          <label>Deal Speed</label>
          <input v-model.lazy="autoTime" type="number" min="0" id="input-deck" />

        </template>
        <template v-else>
          <h4 class="options-title" @click="moreOptions = true" >More Options <i class="material-icons">expand_more</i></h4>
        </template>
        </fieldset>

      </form>

      <div class="options-footer" >
        <button class="btn options-submit" @click="setOptions" >New Game</button>
        <button class="btn options-submit" @click="skipBets" >Skip Bets</button>
      </div>
    </div>
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
      minBet: 100,
      autoTime: 250,
      moreOptions: false,
    };
  },

  methods: {
    setNewPlayer(name, index, isDealer = false) {
      return {
        index,
        name,
        isDealer,
        money: 1000,
        firstBet: 0,
        score: 0,
        inGame: true,
      };
    },
    getOptions() {
      const config = {
        minBet: this.minBet,
        deckCount: this.deckInput,
        autoTime: this.autoTime,
      };

      const players = this.playerInput
        .map((player, index) => this.setNewPlayer(player.name, index));

      const dealer = this.setNewPlayer('Dealer', players.length, true);

      players.push(dealer);

      this.emitCloseOptions();
      return { players, config };
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

    emitCloseOptions() {
      this.$emit('hide');
    },

  },
};
