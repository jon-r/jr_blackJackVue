export function mutationSetters(mutations) {
  const out = {};

  Object.keys(mutations).forEach((mutation) => {
    const key = mutations[mutation];

    out[mutation] = (state, value) => {
      state[key] = value;
    };
  });

  return out;
}

export function playerSetters(mutations) {
  const out = {};

  Object.keys(mutations).forEach((mutation) => {
    // const value = mutations[key].value;
    const key = mutations[mutation];

    out[mutation] = (state, { idx, value }) => {
      const player = state.players[idx];
      player[key] = value;
    };
  });

  return out;
}

export function mutationIncrements(mutations) {
  const out = {};

  Object.keys(mutations).forEach((mutation) => {
    const { value, reset } = mutations[mutation];
   // const reset = mutations[mutation].reset;

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
