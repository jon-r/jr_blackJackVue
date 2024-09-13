import {
  BET_MULTIPLIERS,
  GameOutcomes,
  SIDE_BETS,
} from "~/constants/gamePlay.ts";
import { AUTO_TIME_LONG } from "~/constants/settings.ts";
import { getGameOutcome } from "~/helpers/gamePlay.ts";
import { getRandom } from "~/helpers/math.ts";
import { wait } from "~/helpers/time.ts";
import type { PlayerIdentifier } from "~/types/players.ts";

import { usePlayersStore } from "../playersStore.ts";

export function useBetActions() {
  const playersStore = usePlayersStore();

  function placeBet(playerId: PlayerIdentifier, value: number) {
    const targetPlayer = playersStore.players[playerId.index];

    targetPlayer.money -= value;
    targetPlayer.openBet += value;
    if (targetPlayer.originalBet === 0) {
      targetPlayer.originalBet = value;
    }
  }

  function placeSideBet(
    playerId: PlayerIdentifier,
    multiplier: keyof typeof SIDE_BETS,
  ) {
    const targetPlayer = playersStore.players[playerId.index];

    const extraBet = targetPlayer.originalBet * SIDE_BETS[multiplier];

    placeBet(playerId, extraBet);
  }

  function placeRandomBets() {
    playersStore.activePlayers.forEach((player) => {
      // random bet of at least £100
      const rngBet = Math.min(
        // todo TEMP Math.min
        getRandom(180) * 5 + 100,
        250,
      );

      placeBet(player, rngBet);
    });
  }

  async function settleBet(playerId: PlayerIdentifier, outcome: GameOutcomes) {
    const targetPlayer = playersStore.players[playerId.index];

    targetPlayer.openBet = targetPlayer.openBet * BET_MULTIPLIERS[outcome];
    targetPlayer.outcome = outcome;

    await wait(AUTO_TIME_LONG);

    targetPlayer.money += targetPlayer.openBet;
    targetPlayer.openBet = 0;
    targetPlayer.originalBet = 0;
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

  return { placeBet, placeRandomBets, placeSideBet, settleBet, settleAllBets };
}
