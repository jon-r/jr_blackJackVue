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

function getRandom(range) {
  return Math.floor(Math.random() * range);
}

function buildDeck(deckCount) {
  const out = [];
  const nDecks = new Array(deckCount).fill();
  const nSuits = new Array(4).fill();
  const nFaces = new Array(13).fill();

  nDecks.forEach((x, i) => {
    nSuits.forEach((y, j) => {
      nFaces.forEach((z, k) => {
        out.push([k + 1, j]);
      });
    });
  });
  return out;
}

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    // game stage ids
    gameRound: 0,
    gameStage: 0,
    gameActivePlayer: 0,

    // players & dealer
    dealer: {},
    players: [],
    // deck and cards
    deck: [],
  },

  mutations: {
    // game stage ids
    SET_ROUND(state, i) {
      state.gameRound = i;
    },
    NEXT_ROUND(state) {
      state.gameRound += 1;
    },
    SET_STAGE(state, i) {
      state.gameStage = i;
    },
    NEXT_STAGE(state) {
      state.gameActivePlayer = 0;
      state.gameStage += 1;
    },
    // players & dealer
    SET_PLAYERS(state, playerArr) {
      state.players = playerArr;
    },
    SET_DEALER(state, player) {
      state.dealer = player;
    },
    NEXT_ACTIVE_PLAYER(state) {
      state.gameActivePlayer += 1;
    },
    PLAYER_SET_SCORE(state, { player, score }) {
      state.players[player.index].score = score;
    },
    PLAYER_UPDATE_MONEY(state, { player, money }) {
      state.players[player.index].money += money;
    },
    PLAYER_SET_BID_EVENT(state, { player, event }) {
      state.players[player.index].bidEvent = event;
    },
    PLAYER_CLEAR_BID_EVENT(state, { player, event }) {
      state.players[player.index].bidEvent = '';
    },
    // deck and cards
    SET_DECK(state, deckCount) {
      state.deck = buildDeck(deckCount);
    },
    SPLICE_CARD(state, cardIdx) {
      state.deck.splice(cardIdx, 1);
    },

  },

  actions: {
    // game stage ids
    // setRound: ({ commit }, newRound) => commit('SET_ROUND', newRound),  ??
    newGame: ({ commit }, options) => {
      commit('SET_ROUND', 0);
      commit('SET_DECK', options.deckCount);
      commit('SET_PLAYERS', options.players);
      const dealer = options.players.find(player => player.isDealer);
      commit('SET_DEALER', dealer);
    },
    nextRound: ({ commit }) => commit('NEXT_ROUND'),
    setStage: ({ commit }, newStage) => commit('SET_STAGE', newStage),
    nextStage: ({ commit }) => commit('NEXT_STAGE'),
    nextPlayerPromise: ({ commit }) => new Promise((resolve, reject) => {
      commit('NEXT_ACTIVE_PLAYER');
      resolve();
    }),
    playerEndTurn: ({ state, dispatch }) => dispatch('nextPlayerPromise')
    .then(() => {
      if (state.gameActivePlayer > state.players.length - 1) dispatch('nextStage');
    }),

    // players & dealer
    playerSetScore: ({ commit }, values) => commit('PLAYER_SET_SCORE', values),
    playerUpdateMoney: ({ commit }, values) => commit('PLAYER_UPDATE_MONEY', values),
    bidPromise: ({ commit }, values) => new Promise((resolve, reject) => {
      commit('PLAYER_SET_BID_EVENT', values);
      resolve();
    }),
    playerBidEvent: ({ dispatch, commit }, values) => dispatch('bidPromise', values)
    .then(() => commit('PLAYER_CLEAR_BID_EVENT', values)),

    // deck and cards
    deckDrawPromise: ({ state, commit }, idx) => new Promise((resolve, reject) => {
      const card = state.deck[idx];
      commit('SPLICE_CARD', idx);
      resolve(card);
    }),
    deckDrawRandom: ({ state, dispatch }) => {
      const rng = getRandom(state.deck.length);
      return dispatch('deckDrawPromise', rng);
    },
    deckDrawPeek: ({ state, dispatch }, toMatch) => {

      if (toMatch !== 10 && toMatch !== 11) return Promise.resolve(false);

//      const rng = getRandom(state.deck.length);
      const rng = 0; // temp, to increase the odds of dealer blackjack

      const rngCard = state.deck[rng];
      const rngCardValue = rngCard[0] === 1 ? 11 : Math.min(10, rngCard[0]);



      return (rngCardValue + toMatch === 21) ? dispatch('deckDrawPromise', rng) : Promise.resolve(false);
    },

  },

  getters: {
    // game stage ids
    gameRound: state => state.gameRound,
    gameStage: state => state.gameStage,
    gameActivePlayer: state => state.gameActivePlayer,

    // players & dealer
    players: state => state.players,
    dealerScore: state => state.dealer.score,

    // deck and cards
    // getCard: state => idx => state.deck.idx;
  },

});
