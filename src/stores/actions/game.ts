import { DEALER_STAND_SCORE } from "../../constants/cards.ts";
import { GameStages } from "../../constants/gamePlay.ts";
import { DEALER_ID } from "../../constants/player.ts";
import { isActivePlayer, isNotDealer } from "../../helpers/players.ts";
import { GameConfig } from "../../types/config.ts";
import { PlayerInputStub } from "../../types/players.ts";
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
        isActivePlayer(player) && player.index > coreStore.activePlayerId,
    );

    if (nextPlayer) {
      coreStore.jumpToPlayer(nextPlayer.index);
    } else {
      coreStore.nextStage();
    }
  }

  async function dealInitialCards() {
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
    let dealerMayContinue = true;
    while (dealerMayContinue) {
      await playersStore.revealCard(DEALER_ID);
      dealerMayContinue =
        playersStore.dealer.hands[0].score < DEALER_STAND_SCORE;
    }

    await playersStore.revealAllBlankCards();

    coreStore.jumpToStage(GameStages.EndRound);
  }

  async function finaliseRound() {
    await betActions.settleAllBets();
    playersStore.checkPlayersBalance();
  }

  function nextRound() {
    playersStore.resetCards();
    coreStore.newRound();
  }

  function endGame() {
    playersStore.resetPlayers(playersStore.players.filter(isNotDealer));
    coreStore.jumpToStage(GameStages.Init);
  }

  return {
    startGame,
    dealInitialCards,
    goToNextPlayer,
    dealFinalCards,
    finaliseRound,
    nextRound,
    endGame,
  };
}
