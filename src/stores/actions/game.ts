import { DEALER_STAND_SCORE } from "../../constants/cards.ts";
import { GameStages } from "../../constants/gamePlay.ts";
import { DEALER_ID } from "../../constants/player.ts";
import { GameConfig } from "../../types/config.ts";
import { PlayerInputStub } from "../../types/players.ts";
import { useCoreStore } from "../coreStore.ts";
import { useDeckStore } from "../deckStore.ts";
import { usePlayersStore } from "../playersStore.ts";

export function useGameActions() {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();

  function newGame(players: PlayerInputStub[], config: GameConfig) {
    coreStore.setConfig(config);
    playersStore.resetPlayers(players);
    deckStore.rebuildDeck(config.deckCount);

    coreStore.newRound();
  }

  function goToFirstPlayer() {
    const firstPlayer = playersStore.players.find(
      (player) => player.inGame && !player.isDealer,
    );

    // fixme end game if no players (no bang)
    coreStore.jumpToPlayer(firstPlayer!.index);
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
      await playersStore.dealCard(DEALER_ID);
      dealerMayContinue = playersStore.dealerOutcome.score < DEALER_STAND_SCORE;
    }

    await playersStore.revealAllBlankCards();

    coreStore.jumpToStage(GameStages.EndRound);
  }

  return { newGame, goToFirstPlayer, dealInitialCards, dealFinalCards };
}
