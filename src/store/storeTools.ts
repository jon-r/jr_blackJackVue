import {AppState, PlayerMutation} from "../types/state.ts";
import {Player} from "../types/players.ts";
import type {ActionTree, GetterTree} from "vuex/types/index.d.ts";
// import {Store} from "vuex/types/index.d.ts";

type MutationSetterProps = { [key: string]: keyof AppState; }
type MutationSetterFunction = <Key extends keyof AppState>(state: AppState, value: AppState[Key]) => void;

export function mutationSetters(mutations: MutationSetterProps) {
  const out: Record<string, MutationSetterFunction>  = {};

  Object.keys(mutations).forEach((mutation) => {
    const key = mutations[mutation];

    out[mutation] = (state, value) => {
      // @ts-expect-error - not sure how to type
      state[key] = value;
    };
  });

  return out;
}

type PlayerSetterProps = { [key: string]: keyof Player; }
type PlayerSetterFunction = (state: AppState, mutation: PlayerMutation) => void;

export function playerSetters(mutations: PlayerSetterProps) {
  const out: Record<string, PlayerSetterFunction> = {};

  Object.keys(mutations).forEach((mutation) => {
    // const value = mutations[key].value;
    const key = mutations[mutation];

    out[mutation] = (state, { idx, value }: PlayerMutation) => {
      const player = state.players[idx];

      // @ts-expect-error - not sure how to type
      player[key] = value;
    };
  });

  return out;
}

type MutationIncrementProps = {
  [key: string]: {
    reset: keyof AppState | false;
    value: keyof AppState;
  };
}

type MutationIncrementFunction = (state: AppState) => void;

export function mutationIncrements(mutations: MutationIncrementProps) {
  const out: Record<string,MutationIncrementFunction> = {};

  Object.keys(mutations).forEach((mutation) => {
    const { value, reset } = mutations[mutation];
   // const reset = mutations[mutation].reset;

    out[mutation] = (state) => {
      // @ts-expect-error - not sure how to type
      state[value] += 1;

      // @ts-expect-error - not sure how to type
      if (reset) state[reset] = 0;
    };
  });

  return out;
}


export function actionSetters(actions: Record<string, string>) {
  const out: ActionTree<AppState, AppState> = {};

  Object.keys(actions).forEach((action) => {
    const mutation = actions[action];

    out[action] = ({ commit }, i) => {
      commit(mutation, i)
    };
  });

  return out;
}

export function getState(getters: (keyof AppState)[]) {
  const out: GetterTree<AppState, AppState> = {};
  // const out: SimpleGetterTree = {};

  getters.forEach((getter) => {
    out[getter] = (state: AppState) => state[getter];
  });

  return out;
}
