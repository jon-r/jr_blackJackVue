import { GameOutcomes } from "../../constants/gamePlay.ts";
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

    // https://www.onlineblackjackexplorer.com/how-to-play/blackjack-split/ use these 'common' rules

    // deal/reveal second card to each hand
    // check for outcome?
  }

  async function surrender() {
    await betActions.settleBet(GameOutcomes.Surrendered);
    coreStore.nextPlayer();
  }

  function double() {
    betActions.updateBet(1);
    playersStore.dealBlank();
    coreStore.nextPlayer();
  }

  return { hit, stand, split, surrender, double };
}
