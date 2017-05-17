import Deck from './deck';

export default {
  template: `
  <form id="v-options" class="intro-form" @submit.prevent="setOptions" >

    <span >
      <label for="deckInput" >Decks</label>
      <input v-model.lazy="deckInput" type="text" id="deckInput" />
    </span>

    <span v-for="player in playerInput" :key="playerInput.id" >
      <label :for="playerInput.id" >{{playerInput.label}}</label>
      <input v-model.lazy="playerInput.name" type="text" :id="playerInput.id" />
    </span>

    <input type="submit" val="Update" />
  </form>`,

  data() {
    return {
      playerInput: [
        { label: 'Player 1', name: 'Aaron' },
        { label: 'Player 2', name: 'Beth' },
        { label: 'Player 3', name: 'Chris' },
        { label: 'Player 4', name: 'Denise' },
        { label: 'Player 5', name: 'Ethan' },
      ],
      deckInput: 6,
    };
  },

  methods: {
    setOptions() {
      const output = {
        players: this.playerInput.concat([{ label: 'Dealer', name: 'Dealer' }]),
        deck: new Deck(this.deckInput),
      };
      return this.$emit('submit-options', output);
    },
  },
};
