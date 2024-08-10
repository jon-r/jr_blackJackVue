import { Position } from "./types/animations.ts";

export function setPos(el: HTMLElement, { x, y, r = 0 }: Position) {
  el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
}

export function transformJiggle({ scale = 10, offsetX = 0, offsetY = 0 }) {
  const [x, y, r] = [0, 0, 0].map(() =>
    Math.round((Math.random() - 0.5) * scale),
  );

  return {
    x: x + offsetX,
    y: y + offsetY,
    r,
  };
}

export function arrayStaggeredPush<T>(
  toAdd: T[],
  array: T[],
  staggerTime: number,
) {
  if (toAdd.length === 0) return false;

  const item = toAdd.pop()!;
  array.push(item);
  setTimeout(() => arrayStaggeredPush(toAdd, array, staggerTime), staggerTime);
  return true;
}

export function arrayStaggeredPull<T>(
  toRemove: T[],
  array: T[],
  staggerTime: number,
): T[] | false {
  if (toRemove.length === 0) return false;

  const item = toRemove.pop()!;
  const find = array.indexOf(item);

  if (find !== -1) {
    array.splice(find, 1);
  } else {
    toRemove.push(item);
    // returning the chip that cannot be found;
    return toRemove;
  }
  setTimeout(
    () => arrayStaggeredPull(toRemove, array, staggerTime),
    staggerTime,
  );
  return false;
}
