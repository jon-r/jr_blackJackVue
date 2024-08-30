import { wait } from "../../helpers/time.ts";
import { useCoreStore } from "../coreStore.ts";
// import { useDeckStore } from "../deckStore.ts";
import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";

export function usePlayerActions() {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  // const deckStore = useDeckStore();
  const betActions = useBetActions();

  function hit() {
    playersStore.dealCard();
    playersStore.checkCanContinue();
  }

  function stand() {
    playersStore.nextHand();
  }

  function split() {
    // add second bet
    betActions.updateBet(1);
    // splice hand

    // deal/reveal second card to each hand
    // check for outcome?
  }

  async function surrender() {
    // cash in (half bet)
    // betActions.updateBet(-0.5);
    await betActions.settleBet(0.5);
    // next player
    coreStore.nextPlayer();
  }

  async function double() {
    // add second bet
    betActions.updateBet(1);
    await wait(coreStore.config.autoTime);
    // deal (blank) card
    playersStore.dealBlank();
    // next player
    coreStore.nextPlayer();
  }

  return { hit, stand, split, surrender, double };
}
