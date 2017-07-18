import { mapGetters } from 'vuex';

import { getRandom } from '../deckTools';

import CtrlButton from './button';

export default {
  template: `
  <div class="modal-container flex flex-centre" @click.self="emitCloseOptions" >
    <div class="modal" >

      <header class="modal-header frame-thick" >
        <h3 class="modal-title" >Let's Play BlackJack!</h3>

        <button class="text-btn modal-toggle" @click="emitCloseOptions" >
          <i class="material-icons">close</i>
        </button>
      </header>

      <form id="v-options" class="options-form frame" @submit.prevent="setOptions" >
        <fieldset class="options-group" >
          <h4 class="options-title frame" >Player Names</h4>

          <div v-for="(player,idx) in playerInput" :key="idx" class="input-group flex flex-column frame" >
            <input  v-model.lazy="player.name" type="text" :id="'input-' + idx" />
            <label :for="'input-' + idx" ><i class="material-icons">person</i> Player {{idx}}</label>
          </div>
        </fieldset>

        <fieldset class="options-group" >
        <template v-if="moreOptions" >
          <h4  class="options-title frame" @click="moreOptions = false" >Less Options <i class="material-icons text-btn">expand_less</i></h4>

          <div class="input-group flex flex-column frame" >
            <input v-model.lazy="deckCount" type="number" id="input-deck" />
            <label for="input-deck" ><i class="material-icons">style</i> Decks</label>
          </div>

          <div class="input-group flex flex-column frame" >
            <input v-model.lazy="minBet" type="number" min="0" id="input-bet" />
            <label for="input-bet" ><i class="material-icons">remove_circle</i> Min Bet</label>
          </div>

          <div class="input-group flex flex-column frame" >
            <input v-model.lazy="autoTime" type="number" min="0" id="input-speed" />
            <label for="input-speed" ><i class="material-icons">slow_motion_video</i> Deal Speed</label>
          </div>

        </template>
        <template v-else>
          <h4 class="options-title frame" @click="moreOptions = true" >More Options <i class="material-icons text-btn">expand_more</i></h4>
        </template>
        </fieldset>

      </form>

      <div class="modal-footer frame-thick text-right" >
        <button class="text-btn options-submit" @click="setOptions" >NEW GAME</button>
        <button class="text-btn options-submit" @click="skipBets" >SKIP BETS (DEMO)</button>
      </div>
    </div>
  </div>
  `,

  data() {
    return {
      deckCount: 0,
      minBet: 0,
      autoTime: 0,

      moreOptions: false,
    };
  },

  mounted() {
    this.deckCount = this.config.deckCount;
    this.minBet = this.config.minBet;
    this.autoTime = this.config.autoTime;

    // enable demo mode
    const params = location.search;
    if (params.includes('demo') && this.gameRound < 0) this.skipBets();
  },

  // todo. cleanly linking the options with the state
  // revert to non saving options if cant get done today

  computed: {
    playerInput() {
      // clones the players stored, and fills in the blanks
      const players = this.players.filter(player => !player.isDealer).slice(0);
      const empties = new Array(5 - players.length);
      players.push(...empties);

      return players.map(player => ({ name: player.name || false }));
    },

    ...mapGetters([
      'players',
      'config',
      'gameRound',
    ]),
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
        deckCount: this.deckCount,
        autoTime: this.autoTime,
      };

      const players = this.playerInput
        .map((player, index) => this.setNewPlayer(player.name, index));

      const dealer = this.setNewPlayer('Dealer', players.length, true);

      players.push(dealer);

      return { players, config };
    },
    setOptions() {
      const options = this.getOptions();

      this.emitCloseOptions();

      this.$store.dispatch('newGame', options);
    },
    skipBets() {
      const options = this.getOptions();
      const store = this.$store;

      this.emitCloseOptions();

      store.dispatch('newGame', options)
        .then(() => this.autoBet(0, options.players.length - 1))
        .then(() => store.dispatch('nextPlayerPromise'))
        .then(() => store.dispatch('nextStage'));
    },

    autoBet(idx, max) {
      if (idx > max) return Promise.resolve();

      const store = this.$store;
      const rngBet = (getRandom(10) + 1) * 100;

      const betVals = {
        idx,
        value: rngBet,
      };
      const betEvent = {
        idx,
        type: 'bet',
        value: 'addBet',
      };
      const nextIdx = idx + 1;

      return store.dispatch('playerSetBet', betVals)
        .then(() => store.dispatch('doEvent', betEvent))
        .then(() => this.autoBet(nextIdx, max));
    },

    emitCloseOptions() {
      this.$emit('hide');
    },

  },
};
