import { getRandom } from "../../deckTools.ts";
import { useCoreStore } from "../coreStore.ts";
import { usePlayersStore } from "../playersStore.ts";

export function useBetActions() {
  const playersStore = usePlayersStore();
  const coreStore = useCoreStore();

  function placeBet(value: number, targetId = coreStore.activePlayerId) {
    const targetPlayer = playersStore.players[targetId];

    if (!targetPlayer) {
      return;
    }

    targetPlayer.money -= value;
    targetPlayer.firstBet += value;
    coreStore.sendMessage(`${targetPlayer.name} bets £${value}`);
    coreStore.nextPlayer();
  }

  function placeRandomBets() {
    playersStore.players
      .filter((player) => !player.isDealer)
      .forEach((player) => {
        const rngBet = (getRandom(10) + 1) * 100;

        placeBet(rngBet, player.index);
      });
  }

  return { placeBet, placeRandomBets };
}
