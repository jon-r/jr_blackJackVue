export function setPos(el, { x, y, r = 0 }) {
  el.dataset.posX = x;
  el.dataset.posY = y;
  el.dataset.posR = r;

  el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
}

export function transformJiggle({
  scale = 10,
  offsetX = 0,
  offsetY = 0,
}) {
  const [x, y, r] = [0, 0, 0]
    .map(() => Math.round((Math.random() - 0.5) * scale));

  return {
    x: x + offsetX,
    y: y + offsetY,
    r,
  };
}


export function arrayStaggeredPush(toAdd, array, staggerTime) {
  if (toAdd.length === 0) return false;

  const item = toAdd.pop();
  array.push(item);
  setTimeout(() => arrayStaggeredPush(toAdd, array, staggerTime), staggerTime);
  return true;
}

export function arrayStaggeredPull(toRemove, array, staggerTime) {
  if (toRemove.length === 0) return false;

  const item = toRemove.pop();
  const find = array.indexOf(item);

//  console.log(find);

  if (find !== -1) {
    array.splice(find, 1);
  } else {
    console.log('TODO - pulling half chips');
    return true;
  }
  setTimeout(() => arrayStaggeredPull(toRemove, array, staggerTime), staggerTime);
  return true;
}
