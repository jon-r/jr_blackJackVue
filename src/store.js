// TODO:
/*

[x] gameStages
[\] players (inc active)
[\] dealer (score)
[ ] deck
[ ] game play (move ctrls, or at least the results here?)

*/

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    // game stage ids
    gameStage: 0,
    gameActivePlayer: 0,

    // players & dealer
    dealer: { idx: 0, score: 0 },
    players: [],
    // deck and cards
    deck: [],
  },

  mutations: {
    // game stage ids
    SET_STAGE(state, newStage) {
      state.gameStage = newStage;
    },
    NEXT_STAGE(state) {
      state.gameActivePlayer = 0;
      state.gameStage += 1;
    },
    // players & dealer
    SET_PLAYERS(state, playerArr) {
      state.players = playerArr;
    },
    SET_DEALER_IDX(state, idx) {
      state.dealer.idx = idx;
    },
    NEXT_ACTIVE_PLAYER(state) {
      state.gameActivePlayer += 1;
    },
    // deck and cards
    SET_DECK(state, deckCount) {
      const nDecks = new Array(deckCount).fill();
      const nSuits = new Array(4).fill();
      const nFaces = new Array(13).fill();

      nDecks.forEach((x, i) => {
        nSuits.forEach((y, j) => {
          nFaces.forEach((z, k) => {
            state.deck.push([k + 1, j]);
          });
        });
      });
    },
    SPLICE_CARD(state, cardIdx) {
      // const deck = state.deck;
      state.deck.splice(cardIdx, 1);
    },

  },

  actions: {
    // game stage ids
    setStage: ({ commit }, newStage) => commit('SET_STAGE', newStage),
    nextStage: ({ commit }) => commit('NEXT_STAGE'),
    nextPlayerPromise: ({ commit }) => new Promise((resolve, reject) => {
      commit('NEXT_ACTIVE_PLAYER');
      resolve();
    }),

    // players & dealer
    playerEndTurn: ({ state, dispatch }) => dispatch('nextPlayerPromise')
    .then(() => {
      if (state.gameActivePlayer > state.players.length - 1) dispatch('nextStage');
    }),

    newGame: ({ commit }, options) => {
      commit('SET_DECK', options.deckCount);
      commit('SET_PLAYERS', options.players);
      const dealerIdx = options.players.findIndex(player => player.isDealer);
      commit('SET_DEALER_IDX', dealerIdx);
    },

    // deck and cards
    deckDrawPromise: ({ state, commit }, idx) => new Promise((resolve, reject) => {
      const card = state.deck[idx];
      commit('SPLICE_CARD', idx);
      console.log(card);
      resolve(card);
    }),
    deckDrawRandom: ({ state, dispatch }) => {
      const rng = Math.floor(Math.random() * state.deck.length);
      return dispatch('deckDrawPromise', rng).then(card => card);
    },

    //   => id => state.deck[id],
    // deckGetRandom: (state, getters) => {
    //   const rng = Math.floor(Math.random() * state.deck.length);
    //   return getters.deckDraw(rng);
    // }

  },

  getters: {
    // game stage ids
    gameStage: state => state.gameStage,
    gameActivePlayer: state => state.gameActivePlayer,

    // players & dealer
    players: state => state.players,

    // deck and cards
    // getCard: state => idx => state.deck.idx;
  },

});
