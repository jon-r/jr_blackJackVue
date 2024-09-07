import { GameStages } from "~/constants/gamePlay.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { hasBlackjack, hasBust } from "~/helpers/gamePlay.ts";
import { formatDealerMessage } from "~/helpers/messages.ts";
import { isActivePlayer, isNotDealer } from "~/helpers/players.ts";
import { GameConfig } from "~/types/config.ts";
import { PlayerInputStub } from "~/types/players.ts";

import { useCoreStore } from "../coreStore.ts";
import { useDeckStore } from "../deckStore.ts";
import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";

export function useGameActions() {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();
  const betActions = useBetActions();

  function startGame(players: PlayerInputStub[], config: GameConfig) {
    coreStore.setConfig(config);
    playersStore.resetPlayers(players);
    deckStore.rebuildDeck(config.deckCount);

    coreStore.newRound();
  }

  function goToNextPlayer() {
    const nextPlayer = playersStore.players.find(
      (player) =>
        isActivePlayer(player) &&
        player.index > coreStore.activePlayerId &&
        // todo multihand
        !hasBust(player.hands[0]) &&
        !hasBlackjack(player.hands[0]),
    );

    if (nextPlayer) {
      coreStore.jumpToPlayer(nextPlayer.index);
    } else {
      coreStore.nextStage();
    }
  }

  function placeBets() {
    coreStore.sendMessage("Please place your bets.");
    goToNextPlayer();
  }

  async function dealInitialCards() {
    coreStore.sendMessage("All bets are in, dealing out first cards.");
    // deal one
    await playersStore.dealAllPlayersCards();
    await playersStore.dealCard(DEALER_ID);

    // deal two
    await playersStore.dealAllPlayersCards();
    const peekedBlackjack = await playersStore.dealOrPeekDealer();

    if (peekedBlackjack) {
      coreStore.jumpToStage(GameStages.DealerActions);
    } else {
      coreStore.jumpToStage(GameStages.PlayerActions);
    }
  }

  async function dealFinalCards() {
    await playersStore.revealAllBlankCards();
    coreStore.sendMessage(formatDealerMessage(playersStore.dealer.hands[0]));
    coreStore.jumpToStage(GameStages.EndRound);
  }

  async function finaliseRound() {
    coreStore.sendMessage("Round over. Play again?");
    await betActions.settleAllBets();
    playersStore.checkPlayersBalance();
  }

  function nextRound() {
    playersStore.resetCards();
    coreStore.newRound();
  }

  function endGame() {
    playersStore.resetPlayers(playersStore.players.filter(isNotDealer));
    coreStore.toggleOptionsModal(true);
    coreStore.jumpToStage(GameStages.Init);
  }

  return {
    startGame,
    placeBets,
    dealInitialCards,
    goToNextPlayer,
    dealFinalCards,
    finaliseRound,
    nextRound,
    endGame,
  };
}
