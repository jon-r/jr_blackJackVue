import { GameOutcomes, OUTCOME_MULTIPLIER } from "../../constants/gamePlay.ts";
import { getGameOutcome } from "../../helpers/gamePlay.ts";
import { getRandom } from "../../helpers/math.ts";
import { isPlayerActive } from "../../helpers/players.ts";
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
    targetPlayer.bet += value;
  }

  function updateBet(multiplier: number, targetId = coreStore.activePlayerId) {
    const targetPlayer = playersStore.players[targetId];

    if (!targetPlayer) {
      return;
    }

    const extraBet = targetPlayer.bet * multiplier;

    placeBet(extraBet, targetId);
  }

  function placeRandomBets() {
    playersStore.players.filter(isPlayerActive).forEach((_, id) => {
      const rngBet = (getRandom(10) + 1) * 100;

      placeBet(rngBet, id);
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

    targetPlayer.bet += targetPlayer.bet * OUTCOME_MULTIPLIER[outcome];
    targetPlayer.outcome = outcome;

    await wait(coreStore.config.autoTime);

    targetPlayer.money += targetPlayer.bet;
    targetPlayer.bet = 0;
  }

  function settleAllBets() {
    playersStore.players.forEach(async (player, id) => {
      const outcome = getGameOutcome(player.score, playersStore.dealer.score);

      await settleBet(outcome, id);
    });
  }

  return { placeBet, placeRandomBets, updateBet, settleBet, settleAllBets };
}
