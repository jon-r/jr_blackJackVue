
export function getRandom(range) {
  return Math.floor(Math.random() * range);
}

export function buildDeck(decks) {
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
  return cards;
}

export function mutationSetters(mutations) {
  const out = {};

  Object.keys(mutations).forEach((mutation) => {
    const value = mutations[mutation];

    out[mutation] = (state, i) => {
      state[value] = i;
    };
  });

  return out;
}

export function mutationIncrements(mutations) {
  const out = {};

  Object.keys(mutations).forEach((mutation) => {
    const value = mutations[mutation].value;
    const reset = mutations[mutation].reset;

    out[mutation] = (state, i) => {
      state[value] += 1;
      if (reset) state[reset] = 0;
    };
  });

  return out;
}

export function actionSetters(actions) {
  const out = {};

  Object.keys(actions).forEach((action) => {
    const mutation = actions[action];

    out[action] = ({ commit }, i) => commit(mutation, i);
  });

  return out;
}

export function getState(getters) {
  const out = {};

  getters.forEach((getter) => {
    out[getter] = state => state[getter];
  });

  return out;
}
