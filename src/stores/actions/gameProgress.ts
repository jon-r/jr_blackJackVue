import { GameStages } from "../../constants/gamePlay.ts";
import { GameConfig } from "../../types/config.ts";
import { PlayerInputStub } from "../../types/players.ts";
import { useCoreStore } from "../coreStore.ts";
import { useDeckStore } from "../deckStore.ts";
import { usePlayersStore } from "../playersStore.ts";

export function useGameProgressActions() {
  const coreStore = useCoreStore();
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();

  function newGame(players: PlayerInputStub[], config: GameConfig) {
    coreStore.setConfig(config);
    playersStore.resetPlayers(players);
    deckStore.rebuildDeck(config.deckCount);

    coreStore.startRound();
  }

  async function dealFirstCards() {
    while (coreStore.activeStage === GameStages.DealOne) {
      await playersStore.takeCard();
      playersStore.revealCard();

      coreStore.nextPlayer();
    }
  }

  async function dealSecondCards() {
    while (coreStore.activeStage === GameStages.DealTwo) {
      await playersStore.takeCard();
      // todo dealer may peek
      coreStore.nextPlayer();
    }
  }

  return { newGame, dealFirstCards, dealSecondCards };
}
