import { nextTick } from "vue";

import { GameStages } from "~/constants/gamePlay.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { mayPlayNext } from "~/helpers/gamePlay.ts";
import { formatDealerMessage } from "~/helpers/messages.ts";
import { isNotDealer } from "~/helpers/players.ts";
import type { GameConfig } from "~/types/config.ts";
import type { PlayerInputStub } from "~/types/players.ts";

import { useCoreStore } from "../coreStore.ts";
import { useDeckStore } from "../deckStore.ts";
import { usePlayersStore } from "../playersStore.ts";
import { useBetActions } from "./bets.ts";
import { useCardsActions } from "./cards.ts";

export function useGameActions() {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();
  const betActions = useBetActions();
  const cardsActions = useCardsActions();

  async function startGame(
    players: PlayerInputStub[],
    config: GameConfig,
    isDemo: boolean,
  ) {
    coreStore.setConfig(config);
    playersStore.createPlayers(players);
    deckStore.rebuildDeck(config.deckCount);

    coreStore.toggleOptionsModal(false);
    coreStore.jumpToStage(GameStages.PlaceBets);

    if (isDemo) {
      await nextTick(); // next tick to make sure the players are fully reset before placing new random bets
      betActions.placeRandomBets();
      coreStore.jumpToStage(GameStages.DealCards);
    }
  }

  function goToNextPlayer() {
    const nextPlayer = playersStore.players.find(
      (player) =>
        player.index > coreStore.activePlayerId && mayPlayNext(player),
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
    await cardsActions.dealAllPlayersCards();
    await cardsActions.dealCard(DEALER_ID);

    // deal two
    await cardsActions.dealAllPlayersCards();
    const peekedBlackjack = await cardsActions.dealOrPeekDealerCard();

    if (peekedBlackjack) {
      coreStore.jumpToStage(GameStages.DealerActions);
    } else {
      coreStore.jumpToStage(GameStages.PlayerActions);
    }
  }

  async function dealFinalCards() {
    await cardsActions.revealAllPlayerBlanks();
    await cardsActions.revealDealerBlanks();

    coreStore.sendMessage(formatDealerMessage(playersStore.dealer.hands[0]));
    coreStore.jumpToStage(GameStages.EndRound);
  }

  async function finaliseRound() {
    coreStore.sendMessage("Round over. Play again?");
    await betActions.settleAllBets();

    playersStore.activePlayers.forEach((player) => {
      if (player.money < coreStore.config.minBet) {
        playersStore.removePlayer(player);
      }
    });
  }

  function nextRound() {
    playersStore.resetCards();
    coreStore.jumpToStage(GameStages.PlaceBets);
  }

  function endGame() {
    playersStore.createPlayers(playersStore.players.filter(isNotDealer));
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
