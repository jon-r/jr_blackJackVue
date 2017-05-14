export function getRandom(range) {
  return Math.floor(Math.random() * range);
}

export function randomFrom(arr) {
  const rng = getRandom(arr.length);

  return arr[rng];
}
