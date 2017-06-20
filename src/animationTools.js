export function setPos(el, { x, y, r = 0 }) {
  el.dataset.posX = x;
  el.dataset.posY = y;
  el.dataset.posR = r;
  el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
}

export function setTarget(el, { x, y, r = 0 }) {
  el.dataset.targetX = x;
  el.dataset.targetY = y;
  el.dataset.targetZ = r;
}

export function setStartFinish(el, { start, finish = { x: 0, y: 0, r: 0 } }) {
  setPos(el, start);
  setTarget(el, finish);
}

export function runLerpLoop(el, done) {
  const data = el.dataset;
  const speed = 0.1;

  const closeEnough = (Math.abs(data.posX - data.targetX) < 0.5)
    && (Math.abs(data.posY - data.targetY) < 0.5);

  // ends the lerploop when the element is within 0.5px away from its goal
  if (closeEnough) return done();

  const x = ((1 - speed) * data.posX) + (speed * data.targetX);
  const y = ((1 - speed) * data.posY) + (speed * data.targetY);
  const r = ((1 - speed) * data.posR) + (speed * data.targetZ);

  setPos(el, { x, y, r });

  requestAnimationFrame(() => runLerpLoop(el, done));
  return true;
}

export function setTransformJiggle(el, {
  scale = 10,
  offsetX = 0,
  offsetY = 0,
}) {
  const [x, y, r] = [0, 0, 0]
    .map(() => Math.round((Math.random() - 0.5) * scale));

  el.dataset.targetX = x + offsetX;
  el.dataset.targetY = y + offsetY;
  el.dataset.targetZ = r;
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

