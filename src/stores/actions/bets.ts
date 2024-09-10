import { GameOutcomes, OUTCOME_MULTIPLIER } from "~/constants/gamePlay.ts";
import { AUTO_TIME_LONG } from "~/constants/settings.ts";
import { getGameOutcome } from "~/helpers/gamePlay.ts";
import { getRandom } from "~/helpers/math.ts";
import { wait } from "~/helpers/time.ts";
import { PlayerIdentifier } from "~/types/players.ts";

import { usePlayersStore } from "../playersStore.ts";

export function useBetActions() {
  const playersStore = usePlayersStore();

  function placeBet(playerId: PlayerIdentifier, value: number) {
    const targetPlayer = playersStore.players[playerId.index];

    targetPlayer.money -= value;
    targetPlayer.openBet += value;
  }

  function updateBet(playerId: PlayerIdentifier, multiplier: number) {
    const targetPlayer = playersStore.players[playerId.index];

    const extraBet = targetPlayer.openBet * multiplier;

    placeBet(playerId, extraBet);
  }

  function placeRandomBets() {
    playersStore.activePlayers.forEach((player) => {
      const rngBet = (getRandom(10) + 1) * 100;

      placeBet(player, rngBet);
    });
  }

  async function settleBet(playerId: PlayerIdentifier, outcome: GameOutcomes) {
    const targetPlayer = playersStore.players[playerId.index];

    targetPlayer.openBet += targetPlayer.openBet * OUTCOME_MULTIPLIER[outcome];
    targetPlayer.outcome = outcome;

    await wait(AUTO_TIME_LONG);

    targetPlayer.money += targetPlayer.openBet;
    targetPlayer.openBet = 0;
  }

  async function settleAllBets() {
    const promises = playersStore.activePlayers.map(async (player) => {
      if (!player.outcome) {
        const outcome = getGameOutcome(player.hands, playersStore.dealer.hands);

        await settleBet(player, outcome);
      }
    });

    await Promise.all(promises);
  }

  return { placeBet, placeRandomBets, updateBet, settleBet, settleAllBets };
}
