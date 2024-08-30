import { GameStages } from "../../constants/gamePlay.ts";
import { wait } from "../../helpers/time.ts";
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

    coreStore.startRound();
  }

  // todo handle players that arent playing
  async function dealInitialCards() {
    for (let i = 0; i < playersStore.players.length; i++) {
      playersStore.dealCard(i);
      await wait(coreStore.config.autoTime);
    }
    for (let j = 0; j < playersStore.players.length; j++) {
      playersStore.dealOrPeek(j);
      await wait(coreStore.config.autoTime);
    }
    coreStore.jumpToStage(GameStages.PlayerActions);
  }

  return { newGame, dealInitialCards };
}
