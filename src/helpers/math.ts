export function getRandom(range: number): number {
  return Math.floor(Math.random() * range);
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
