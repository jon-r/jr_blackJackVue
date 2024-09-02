import { GameOutcomes, OUTCOME_MULTIPLIER } from "../../constants/gamePlay.ts";
import { getGameOutcome } from "../../helpers/gamePlay.ts";
import { getRandom } from "../../helpers/math.ts";
import { isActivePlayer } from "../../helpers/players.ts";
import { wait } from "../../helpers/time.ts";
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
    targetPlayer.openBet += value;
  }

  function updateBet(multiplier: number, targetId = coreStore.activePlayerId) {
    const targetPlayer = playersStore.players[targetId];

    if (!targetPlayer) {
      return;
    }

    const extraBet = targetPlayer.openBet * multiplier;

    placeBet(extraBet, targetId);
  }

  function placeRandomBets() {
    playersStore.players.filter(isActivePlayer).forEach((player) => {
      const rngBet = (getRandom(10) + 1) * 100;

      placeBet(rngBet, player.index);
    });
  }

  async function settleBet(
    outcome: GameOutcomes,
    targetId = coreStore.activePlayerId,
  ) {
    const targetPlayer = playersStore.players[targetId];

    if (!targetPlayer) {
      return;
    }

    targetPlayer.openBet += targetPlayer.openBet * OUTCOME_MULTIPLIER[outcome];
    targetPlayer.outcome = outcome;

    await wait(coreStore.config.autoTime);

    targetPlayer.money += targetPlayer.openBet;
    targetPlayer.openBet = 0;
  }

  // todo skip if already settled (bust or surrendered)
  function settleAllBets() {
    playersStore.players.filter(isActivePlayer).forEach(async (player) => {
      if (!player.outcome) {
        // todo get best player hand
        const outcome = getGameOutcome(player.hands, playersStore.dealer.hands);

        await settleBet(outcome, player.index);
      }
    });
  }

  return { placeBet, placeRandomBets, updateBet, settleBet, settleAllBets };
}
