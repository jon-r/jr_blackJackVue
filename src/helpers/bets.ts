import { CHIP_VALUES, GameOutcomes } from "~/constants/gamePlay.ts";

export function moneyToChips(money: number): number[] {
  let chipsRemainingValue = money;
  const chips = [];
  while (chipsRemainingValue > 0) {
    const bestChip = CHIP_VALUES.find((value) => value <= chipsRemainingValue);

    if (!bestChip) break;

    chipsRemainingValue -= bestChip;
    chips.push(bestChip);
  }

  return chips;
}

export function hasMoneyReturned(outcome: GameOutcomes | null) {
  return (
    outcome === GameOutcomes.Blackjack ||
    outcome === GameOutcomes.Won ||
    outcome === GameOutcomes.Push
  );
}

export function hasMoneyLost(outcome: GameOutcomes | null) {
  return outcome === GameOutcomes.Lost || outcome === GameOutcomes.Surrendered;
}
