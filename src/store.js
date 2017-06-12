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

function buildDeck(decks) {
  const cards = [];
  const nDecks = new Array(decks).fill();
  const nSuits = new Array(4).fill();
  const nFaces = new Array(13).fill();

  nDecks.forEach((x, i) => {
    nSuits.forEach((y, j) => {
      nFaces.forEach((z, k) => {
        cards.push([k + 1, j]);
      });
    });
  });
  return { cards, count: decks };
}

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    // game stage ids
    gameRound: 0,
    gameStage: 0,
    gameActivePlayer: -1,

    // players & dealer
    dealer: {},
    players: [],
    activePlayerCount: 0,

    // deck and cards
    deck: [],

    // other options
    config: {
      minBid: 0,
      autoTime: 250,
      deckCount: 6,
    },

  },

  mutations: {
    // game stage ids
    SET_ROUND(state, i) {
      state.gameRound = i;
    },
    NEXT_ROUND(state) {
      state.gameStage = 0;
      state.gameRound += 1;
    },
    SET_STAGE(state, i) {
      state.gameActivePlayer = 0;
      state.gameStage = i;
    },
    NEXT_STAGE(state) {
      state.gameActivePlayer = 0;
      state.gameStage += 1;
    },

    // players & dealer
    SET_PLAYERS(state, playerArr) {
      state.players = playerArr;
      state.activePlayerCount = playerArr.length - 1;
    },
    SET_DEALER(state, dealer) {
      state.dealer = dealer;
      state.dealer.peeked = false;
    },
    NEXT_ACTIVE_PLAYER(state) {
      state.gameActivePlayer += 1;
    },
    PLAYER_SET_SCORE(state, { player, score }) {
      state.players[player.index].score = score;
    },
    PLAYER_UPDATE_MONEY(state, { player, money, bet }) {
      const thisPlayer = state.players[player.index];
      thisPlayer.money += money;
      thisPlayer.startBid = bet;
    },
    PLAYER_SET_BID_EVENT(state, { player, event }) {
      state.players[player.index].bidEvent = event;
    },
    PLAYER_CLEAR_BID_EVENT(state, { player, event }) {
      state.players[player.index].bidEvent = '';
    },
    PLAYER_RESET_SCORES(state) {
      state.players.forEach(player => (player.score = 0));
    },
    DEALER_SET_PEEKED(state, card) {
      state.dealer.peeked = card;
    },
    PLAYER_END_GAME(state, player) {
      state.players[player.index].inGame = false;
    },

    // deck and cards
    SET_DECK(state, deck) {
      state.deck = deck.cards;
      state.config.deckCount = deck.count;
    },
    SPLICE_CARD(state, cardIdx) {
      state.deck.splice(cardIdx, 1);
    },

    // other options
    SET_MIN_BID(state, minBid) {
      state.config.minBid = minBid;
    },

  },

  actions: {
    // game stage ids
    newGame: ({ commit }, options) => {
      console.log('new game');

      const dealer = options.players.find(player => player.isDealer);
      const deck = buildDeck(options.deckCount);
      commit('NEXT_ACTIVE_PLAYER');
      commit('SET_MIN_BID', options.minBid);
      commit('SET_ROUND', 0);
      commit('SET_DECK', deck);
      commit('SET_PLAYERS', options.players);
      commit('SET_DEALER', dealer);
    },

    nextRound: ({ state, commit }) => {
      console.log('new round');
      if (state.activePlayerCount < 1) {
        console.log('GAME OVER');
        return false;
      }
      const deck = buildDeck(state.config.deckCount);

      commit('PLAYER_RESET_SCORES');
      commit('NEXT_ROUND');
      commit('SET_DECK', deck);
      return true;
    },

    nextStagePromise: ({ commit }) => new Promise((resolve) => {
      commit('NEXT_STAGE');
      resolve();
    }),

    nextStage: ({ state, dispatch }) => dispatch('nextStagePromise').then(() => {
      setTimeout(() => {
        if (state.gameStage === 5) {
          dispatch('nextRound');
        }
      }, 3000);
    }),

    setStage: ({ commit }, i) => commit('SET_STAGE', i),

    nextPlayerPromise: ({ commit }) => new Promise((resolve) => {
      commit('NEXT_ACTIVE_PLAYER');
      resolve();
    }),

    nextPlayer: ({ state, dispatch }) => dispatch('nextPlayerPromise').then(() => {
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

    dealerCard: ({ commit }, card) => commit('DEALER_SET_PEEKED', card),

    playerEndGame: ({ commit }, player) => commit('PLAYER_END_GAME', player),

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

      if (rngCardValue + toMatch === 21) {
        return dispatch('deckDrawPromise', rng);
      }

      dispatch('deckDrawPromise', rng).then(card => dispatch('dealerCard', card));
      return Promise.resolve(false);
    },
  },

  getters: {
    // game stage ids
    gameRound: state => state.gameRound,
    gameStage: state => state.gameStage,
    gameActivePlayer: state => state.gameActivePlayer,

    // players & dealer
    players: state => state.players,
    dealer: state => state.dealer,

    // deck and cards
    // getCard: state => idx => state.deck.idx;

    // other options
    minBid: state => state.config.minBid,
    autoTime: state => state.config.autoTime,
  },

});
