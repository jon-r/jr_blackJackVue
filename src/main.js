import Vue from 'vue';
import PlayerBase from './players/players';
import gamePlay from './game-data';

const app = new Vue({
  el: '#v-blackJack',
  components: {
    'player-base': PlayerBase,
  },

  data: {
    shared: gamePlay.state,
    form: {
      playerInput: [
        { id: 1, label: 'Player 1', name: 'Aaron' },
        { id: 2, label: 'Player 2', name: 'Beth' },
        { id: 3, label: 'Player 3', name: 'Chris' },
        { id: 4, label: 'Player 4', name: 'Denise' },
        { id: 5, label: 'Player 5', name: 'Ethan' },
      ],
      deckInput: 6,
    },
  },
  created() {

  },
  methods: {
    newGame() {
      gamePlay.newGame(this.form);
    },
  },
});

// just here to skip the 'unused' error
export default app;
