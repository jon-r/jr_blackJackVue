import { BLACKJACK_SCORE } from "~/constants/cards.ts";
import { GameOutcomes } from "~/constants/gamePlay.ts";
import { formatPlayerMessage } from "~/helpers/messages.ts";
import { useCardsActions } from "~/stores/actions/cards.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { Player } from "~/types/players.ts";

import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";
import { useGameActions } from "./game.ts";

export function usePlayerActions() {
  const playersStore = usePlayersStore();
  const coreStore = useCoreStore();
  const betActions = useBetActions();
  const gameActions = useGameActions();
  const cardsActions = useCardsActions();

  function nextHandOrPlayer() {
    const nextHand = playersStore.getNextHand();
    if (!nextHand) {
      gameActions.goToNextPlayer();
    }
  }

  async function checkScore(player: Player) {
    const hand = playersStore.getPlayerHand(player.index);

    if (!hand) return;

    if (hand.score > BLACKJACK_SCORE) {
      await betActions.settleBet(GameOutcomes.Lost);
    }

    if (hand.score >= BLACKJACK_SCORE) {
      return nextHandOrPlayer();
    }

    // else continue
  }

  function submitBet(player: Player, value: number) {
    coreStore.sendMessage(`${player.name} bets £${value}`);
    betActions.placeBet(value);
    gameActions.goToNextPlayer();
  }

  async function hit(player: Player) {
    const card = await cardsActions.dealCard(player.index);
    coreStore.sendMessage(formatPlayerMessage(player, "hits", card));

    await checkScore(player);
  }

  function stand(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "stands"));
    nextHandOrPlayer();
  }

  // todo multihand
  function split(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "splits"));

    // add second bet
    betActions.updateBet(1);
    // splice hand

    // https://www.onlineblackjackexplorer.com/how-to-play/blackjack-split/ use these 'common' rules

    // deal/reveal second card to each hand
    // check for outcome?
  }

  async function surrender(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "surrenders"));

    await betActions.settleBet(GameOutcomes.Surrendered);
    gameActions.goToNextPlayer();
  }

  async function double(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "doubles"));

    betActions.updateBet(1);
    await cardsActions.dealBlank(player.index);
    gameActions.goToNextPlayer();
  }

  return { hit, stand, split, surrender, double, submitBet };
}
