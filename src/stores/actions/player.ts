import { GameOutcomes } from "~/constants/gamePlay.ts";
import { isAce } from "~/helpers/cards.ts";
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
    const nextHand = playersStore.nextHand(player);

    if (!nextHand) {
      gameActions.goToNextPlayer();
    } else if (playerMustStand(nextHand)) {
      nextHandOrPlayer(player);
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

  async function split(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "splits"));

    betActions.placeSideBet(player, "split");

    const originalHand = player.hands[player.activeHandId];

    await playersStore.splitHand(player);

    // deal/reveal second card to each hand
    for (let i = 0; i < player.hands.length; i++) {
      if (player.hands[i].cards.length === 1) {
        await cardsActions.dealCard({ index: player.index, activeHandId: i });
      }
    }

    // if the hands were aces, no more actions can be made so go to next person
    if (isAce(originalHand.cards[0])) {
      gameActions.goToNextPlayer();
    }
  }

  async function surrender(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "surrenders"));

    await betActions.settleBet(player, GameOutcomes.Surrendered);
    gameActions.goToNextPlayer();
  }

  async function double(player: Player) {
    coreStore.sendMessage(formatPlayerMessage(player, "doubles"));

    betActions.placeSideBet(player, "double");
    await cardsActions.dealBlank(player);
    gameActions.goToNextPlayer();
  }

  return { hit, stand, split, surrender, double, submitBet };
}
