import { GameOutcomes } from "~/constants/gamePlay.ts";
import { formatPlayerMessage } from "~/helpers/messages.ts";
import {
  getPlayerHand,
  hasBust,
  playerMustStand,
} from "~/helpers/playerHands.ts";
import type { Player } from "~/types/players.ts";

import { useCoreStore } from "../coreStore.ts";
import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";
import { useCardsActions } from "./cards.ts";
import { useGameActions } from "./game.ts";

export function usePlayerActions() {
  const playersStore = usePlayersStore();
  const coreStore = useCoreStore();
  const betActions = useBetActions();
  const gameActions = useGameActions();
  const cardsActions = useCardsActions();

  function nextHandOrPlayer(player: Player) {
    const nextHand = playersStore.getNextHand(player);
    if (!nextHand) {
      gameActions.goToNextPlayer();
    }
  }

  async function checkScore(player: Player) {
    const targetHand = getPlayerHand(playersStore.players, player);

    if (!targetHand) return;

    if (hasBust(targetHand)) {
      await betActions.settleBet(player, GameOutcomes.Lost);
    }

    if (playerMustStand(targetHand)) {
      nextHandOrPlayer(player);
    }

    // else continue
  }

  function submitBet(player: Player, value: number) {
    coreStore.sendMessage(`${player.name} bets £${value}`);
    betActions.placeBet(player, value);
    gameActions.goToNextPlayer();
  }

  async function hit(player: Player) {
    const card = await cardsActions.dealCard(player);
    coreStore.sendMessage(formatPlayerMessage(player, "hits", card));

    await checkScore(player);
  }

  function stand(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "stands"));
    nextHandOrPlayer(player);
  }

  // todo multihand
  async function split(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "splits"));

    // add second bet
    betActions.updateBet(player, 1);

    await playersStore.splitHand(player);

    const secondToLastHandId = player.hands.length - 2;
    for (let i = secondToLastHandId; i < player.hands.length; i++) {
      await cardsActions.dealCard({ index: player.index, activeHandId: i });
    }

    // https://www.onlineblackjackexplorer.com/how-to-play/blackjack-split/ use these 'common' rules

    // deal/reveal second card to each hand
    // check for outcome?
  }

  async function surrender(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "surrenders"));

    await betActions.settleBet(player, GameOutcomes.Surrendered);
    gameActions.goToNextPlayer();
  }

  async function double(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "doubles"));

    betActions.updateBet(player, 1);
    await cardsActions.dealBlank(player);
    gameActions.goToNextPlayer();
  }

  return { hit, stand, split, surrender, double, submitBet };
}
