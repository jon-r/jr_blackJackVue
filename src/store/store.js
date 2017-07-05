// combine more into more ... function groups?
// merge commonly done actions into big chains ()

import Vue from 'vue';
import Vuex, { mapMutations } from 'vuex';

import { mutationSetters, mutationIncrements, actionSetters, getState, playerSetters } from './storeTools';
import { getRandom, buildDeck } from '../deckTools';

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    // game stage ids
    gameRound: -1,
    gameStage: -1,
    gameActivePlayer: -1,

    // players & dealer
    dealer: {},
    players: [
      { name: 'Aaron' },
      { name: 'Beth' },
      { name: 'Chris' },
      { name: 'Denise' },
      { name: 'Ethan' },
    ],

    // deck and cards
    deck: [],
    shoePos: {},

    // other options
    config: {
      minBet: 100,
      autoTime: 250,
      deckCount: 6,
    },

    newMessage: '',

    handRules: false,

    eventID: 0,
    eventBus: {
      idx: -1,
      type: false,
      value: false,
    },

  },

  mutations: {

    // players & dealer
    PLAYER_UPDATE_MONEY(state, { idx, value }) {
      state.players[idx].money += value;
    },

    PLAYER_DOUBLE_BET(state, { idx }) {
      state.players[idx].firstBet *= 2;
    },

//    RESET_PLAYERS(state) {
//      const playerNames =
//      state.players.forEach(player => {
//
//      })
//    },

    DEALER_SET_PEEKED(state, card) {
      state.dealer.peeked = card;
    },

    // deck and cards
    SPLICE_CARD(state, cardIdx) {
      state.deck.splice(cardIdx, 1);
    },

    ...mutationIncrements({
      NEXT_ROUND: { reset: 'gameStage', value: 'gameRound' },
      NEXT_STAGE: { reset: 'gameActivePlayer', value: 'gameStage' },
      NEXT_ACTIVE_PLAYER: { value: 'gameActivePlayer', reset: false },
      NEXT_EVENT: { value: 'eventID', reset: false },
    }),

    ...mutationSetters({
      SET_STAGE: 'gameStage',
      SET_ACTIVE_PLAYER: 'gameActivePlayer',
      SET_PLAYERS: 'players',
      SET_PLAYER_COUNT: 'activePlayerCount',
      SET_DEALER: 'dealer',
      SET_ROUND: 'gameRound',
      SET_DECK: 'deck',
      SET_SHOE_POS: 'shoePos',
      SET_CONFIG: 'config',
      CTRL_SET_HAND_RULES: 'handRules',
      SET_EVENT: 'eventBus',
      SET_MESSAGE: 'newMessage',
    }),

    ...playerSetters({
      PLAYER_END_GAME: 'inGame',
      PLAYER_SET_SCORE: 'score',
      PLAYER_SET_BET: 'firstBet',
    }),
  },

  actions: {
    // game stage ids
    newGame: ({ commit, dispatch }, options) => {
      const dealer = options.players.find(player => player.isDealer);
      const deck = buildDeck(options.config.deckCount);

      return dispatch('resetGame')
        .then(() => {
          commit('NEXT_ROUND');
          commit('SET_CONFIG', options.config);
          commit('SET_DECK', deck);
          commit('SET_PLAYERS', options.players);
          commit('SET_PLAYER_COUNT', options.players.length);
          commit('SET_DEALER', dealer);
        })
        .then(() => commit('NEXT_ACTIVE_PLAYER')); // set last to trigger the first player actions
    },

    resetGame: ({ commit, state }) => new Promise((resolve) => {
      const names = state.players.map(player => player.name);

      commit('SET_PLAYERS', names);
      commit('SET_ACTIVE_PLAYER', -1);
      commit('SET_STAGE', -1);
      resolve();
    }),

    nextRound: ({ state, commit }) => {
      const quarterDeck = (state.config.deckCount * 13); // 25% of total cards in game = reshuffle

      state.players.forEach(player => commit('PLAYER_SET_SCORE', { idx: player.index, value: 0 }));
      commit('NEXT_ROUND');
      commit('SET_ACTIVE_PLAYER', -1);

      if (state.deck.length < quarterDeck) {
        const deck = buildDeck(state.config.deckCount);
        commit('SET_DECK', deck);
        commit('SET_MESSAGE', 'Reshuffling the deck');
      }

      setTimeout(() => commit('NEXT_ACTIVE_PLAYER'), 200);
      return true;
    },

    nextStage: ({ commit }) => {
      commit('NEXT_STAGE');
    },

    nextPlayerPromise: ({ commit }) => new Promise((resolve) => {
      commit('NEXT_ACTIVE_PLAYER');
      resolve();
    }),

    nextPlayer: ({ state, dispatch }) => dispatch('nextPlayerPromise').then(() => {
      if (state.gameActivePlayer > state.players.length - 1) dispatch('nextStage');
    }),

    // players
    playerSetBet: ({ commit }, { idx, value, double = false }) => new Promise((resolve) => {
      commit('PLAYER_UPDATE_MONEY', { idx, value: -value });
      commit('PLAYER_SET_BET', { idx, value });
      resolve();
    }),

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

      const rng = getRandom(state.deck.length);
//      const rng = 0; // debug to force dealer blackJAcks

      const rngCard = state.deck[rng];
      const rngCardValue = rngCard[0] === 1 ? 11 : Math.min(10, rngCard[0]);

      if (rngCardValue + toMatch === 21) {
        return dispatch('deckDrawPromise', rng);
      }

      dispatch('deckDrawPromise', rng).then(card => dispatch('dealerCard', card));
      return Promise.resolve(false);
    },

    doEvent: ({ commit }, values) => new Promise((resolve) => {
      commit('SET_EVENT', values);
      commit('NEXT_EVENT');
      resolve();
    }),

    ...actionSetters({
      setStage: 'SET_STAGE',
      playerSetScore: 'PLAYER_SET_SCORE',
      playerDoubleBet: 'PLAYER_DOUBLE_BET',
      playerUpdateMoney: 'PLAYER_UPDATE_MONEY',
      dealerCard: 'DEALER_SET_PEEKED',
      playerEndGame: 'PLAYER_END_GAME',
      handCtrlRules: 'CTRL_SET_HAND_RULES',
      setShoePos: 'SET_SHOE_POS',
      setNewMessage: 'SET_MESSAGE',
    }),
  },

  getters: {

    // other options
    minBet: state => state.config.minBet,
    autoTime: state => state.config.autoTime,

    // starts at -1 to skip dealer;
    activePlayerCount: state => state.players
      .reduce((n, player) => n + (player.inGame), -1),


    ...getState([
      'gameRound',
      'gameStage',
      'gameActivePlayer',
      'players',
      'dealer',
      'handRules',
      'eventID',
      'eventBus', // TODO bonus; combine events to a single getter? and check any other getters
      'shoePos',
      'newMessage',
      'config',
    ]),
  },

});
