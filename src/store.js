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
      state.dealer.idx = playerArr.findIndex(player => player.isDealer);
    },
    SET_DEALER_IDX(state, idx) {
      state.dealer.idx = idx;
    },
    NEXT_ACTIVE_PLAYER(state) {
      state.gameActivePlayer += 1;
    },
    // deck and cards

  },

  actions: {
    // game stage ids
    setStage: ({ commit }, newStage) => commit('SET_STAGE', newStage),
    nextStage: ({ commit }) => commit('NEXT_STAGE'),
    nextPlayer: ({ commit }) => new Promise((resolve, reject) => {
      commit('NEXT_ACTIVE_PLAYER');
      resolve();
    }),

    // players & dealer
    setPlayers: ({ commit }, playerArr) => commit('SET_PLAYERS', playerArr),
    playerEndTurn: ({ state, dispatch }) => dispatch('nextPlayer').then(() => {
      if (state.gameActivePlayer > state.players.length - 1) dispatch('nextStage');
    }),

    // deck and cards

  },

  getters: {
    // game stage ids
    gameStage: state => state.gameStage,
    gameActivePlayer: state => state.gameActivePlayer,

    // players & dealer
    players: state => state.players,
    dealerIdx: state => state.dealerIdx,

    // deck and cards
  },

});
