import { Position } from "~/types/animations.ts";

import { getRandom } from "./math.ts";

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
