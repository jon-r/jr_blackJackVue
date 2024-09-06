import { Position } from "~/types/animations.ts";

import { getRandom } from "./math.ts";
import { wait } from "./time.ts";

export function transformJiggle({
  scale = 10,
  offsetX = 0,
  offsetY = 0,
}): Position {
  const [x, y, r] = Array.from({ length: 3 }, () => getRandom(scale));

  return {
    x: x + offsetX,
    y: y + offsetY,
    r,
  };
}

export async function staggeredPush<T>(
  originalArray: T[],
  itemsToAdd: T[],
  durationMs: number,
) {
  for (let i = 0; i < itemsToAdd.length; i++) {
    originalArray.push(itemsToAdd[i]);
    console.log(originalArray);
    await wait(durationMs);
  }
}

export async function staggeredPop<T>(
  originalArray: T[],
  itemsToRemove: T[],
  durationMs: number,
) {
  for (let i = 0; i < itemsToRemove.length; i++) {
    const find = originalArray.indexOf(itemsToRemove[i]);

    if (find === -1) {
      return itemsToRemove[i];
    }

    originalArray.splice(find, 1);

    await wait(durationMs);
  }
}

export function setElementPosition(el: HTMLElement, { x, y, r = 0 }: Position) {
  el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
}
