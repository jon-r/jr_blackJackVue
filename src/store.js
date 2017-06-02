// TODO:
/*

[ ] gameStages
[ ] players (inc active)
[ ] dealer (score)
[ ] deck
[ ] game play (move ctrls, or at least the results here?)

*/

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    gameStage: 0,
    activePlayer: 0,

    dealerScore: 0,
    players: [],
    deck: [],
  },

  mutations: {
    SET_STAGE(state, newStage) {
      state.gameStage = newStage;
    },
    NEXT_STAGE(state) {
      state.gameStage += 1;
    },
    NEXT_PLAYER(state, player) {
      state.activePlayer += 1;
    },
  },

  actions: {
    nextStage: (({ commit }) => commit('NEXT_STAGE')),
    setStage: (({ commit }, newStage) => commit('SET_STAGE', newStage)),
  },

  getters: {
    gameStage: state => state.gameStage,
  },

});
