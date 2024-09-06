import { BLACKJACK_SCORE } from "~/constants/cards.ts";
import { GameOutcomes } from "~/constants/gamePlay.ts";

import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";
import { useGameActions } from "./game.ts";

export function usePlayerActions() {
  const playersStore = usePlayersStore();
  const betActions = useBetActions();
  const gameActions = useGameActions();

  function nextHandOrPlayer() {
    const nextHand = playersStore.nextHand();
    if (!nextHand) {
      gameActions.goToNextPlayer();
    }
  }

  async function checkScore() {
    const hand = playersStore.getPlayerHand();

    if (!hand) return;

    if (hand.score > BLACKJACK_SCORE) {
      await betActions.settleBet(GameOutcomes.Lost);
    }

    if (hand.score >= BLACKJACK_SCORE) {
      return nextHandOrPlayer();
    }

    // else continue
  }

  async function hit() {
    await playersStore.dealCard();
    await checkScore();
  }

  function stand() {
    nextHandOrPlayer();
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
    gameActions.goToNextPlayer();
  }

  function double() {
    betActions.updateBet(1);
    playersStore.dealBlank();
    gameActions.goToNextPlayer();
  }

  return { hit, stand, split, surrender, double };
}
