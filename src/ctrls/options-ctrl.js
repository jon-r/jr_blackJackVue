export default {
  template: `
  <div class="options-outer center-content" >
    <div class="options-inner" >
      <button class="btn menu-toggle material-icons" @click="emitCloseOptions" >close</button>
      <form id="v-options" class="options-form" @submit.prevent="setOptions" >
        <fieldset class="options-group frame" >
          <h4 class="options-title frame" >Player Names</h4>

          <div v-for="(player,idx) in playerInput" :key="idx" class="input-group frame" >
            <input  v-model.lazy="player.name" type="text" :id="'input-' + idx" />
            <label :for="'input-' + idx" ><i class="material-icons">person</i> Player {{idx}}</label>
          </div>
        </fieldset>

        <fieldset class="options-group frame" >
        <template v-if="moreOptions" >
          <h4  class="options-title frame" @click="moreOptions = false" >Less Options <i class="material-icons">expand_less</i></h4>

          <div class="input-group frame" >
            <input v-model.lazy="deckInput" type="number" id="input-deck" />
            <label for="input-deck" ><i class="material-icons">style</i> Decks</label>
          </div>

          <div class="input-group frame" >
            <input v-model.lazy="minBet" type="number" min="0" id="input-bet" />
            <label for="input-bet" ><i class="material-icons">remove_circle</i> Min Bet</label>
          </div>

          <div class="input-group frame" >
            <input v-model.lazy="autoTime" type="number" min="0" id="input-speed" />
            <label for="input-speed" ><i class="material-icons">slow_motion_video</i> Deal Speed</label>
          </div>

        </template>
        <template v-else>
          <h4 class="options-title frame" @click="moreOptions = true" >More Options <i class="material-icons">expand_more</i></h4>
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

      this.autoBet(0, options.players.length - 1)
        .then(() => this.$store.dispatch('nextPlayerPromise'))
        .then(() => setTimeout(() => this.$store.dispatch('nextStage'), 2000));
    },

    autoBet(idx, max) {
      console.log(idx, max);
      if (idx > max) return Promise.resolve();

      const betVals = {
        idx,
        value: 500,
      };
      const betEvent = {
        idx,
        type: 'bet',
        value: 'addBet',
      };
      const nextIdx = idx + 1;

      return this.$store.dispatch('playerSetBet', betVals)
        .then(() => this.$store.dispatch('doEvent', betEvent))
        .then(() => this.autoBet(nextIdx, max));
    },

    emitCloseOptions() {
      this.$emit('hide');
    },

  },
};
