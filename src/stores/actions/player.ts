import { useCoreStore } from "../coreStore.ts";
import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";

export function usePlayerActions() {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  const betActions = useBetActions();

  async function hit() {
    await playersStore.dealCard();
    playersStore.checkPlayerScore();
  }

  function stand() {
    playersStore.nextHand();
  }

  // fixme
  function split() {
    // add second bet
    betActions.updateBet(1);
    // splice hand

    // deal/reveal second card to each hand
    // check for outcome?
  }

  function surrender() {
    betActions.settleBet(0.5);
    coreStore.nextPlayer();
  }

  function double() {
    betActions.updateBet(1);
    playersStore.dealBlank();
    coreStore.nextPlayer();
  }

  return { hit, stand, split, surrender, double };
}
