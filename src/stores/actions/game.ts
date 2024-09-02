import { DEALER_STAND_SCORE } from "../../constants/cards.ts";
import { GameStages } from "../../constants/gamePlay.ts";
import { DEALER_ID } from "../../constants/player.ts";
import { isActivePlayer } from "../../helpers/players.ts";
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

  function newGame(players: PlayerInputStub[], config: GameConfig) {
    coreStore.setConfig(config);
    playersStore.resetPlayers(players);
    deckStore.rebuildDeck(config.deckCount);

    coreStore.newRound();
  }

  function goToFirstPlayer() {
    const firstPlayerId = playersStore.players.findIndex(isActivePlayer);

    // fixme end game if no players
    coreStore.jumpToPlayer(firstPlayerId);
  }

  async function dealInitialCards() {
    // deal one
    await playersStore.dealAllPlayersCards();
    await playersStore.dealCard(DEALER_ID);

    // deal two
    await playersStore.dealAllPlayersCards();
    await playersStore.dealOrPeekDealer();

    coreStore.jumpToStage(GameStages.PlayerActions);
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

  function finaliseRound() {
    betActions.settleAllBets();

    // todo disable any fully lost players here
  }

  return {
    newGame,
    dealInitialCards,
    goToFirstPlayer,
    dealFinalCards,
    finaliseRound,
  };
}
