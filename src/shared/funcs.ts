// export function makeEqual<T>(target: T, value: T) {
//   for (const key in value) {
//     target[key] = value[key];
//   }
// }

export function findIndexN<T>(
  arr: Array<T>,
  predicate: (value: T, index: number) => boolean,
): number | null {
  const index = arr.findIndex(predicate);

  return index != -1 ? index : null;
}

export function genRand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function remove<T>(arr: Array<T>, value: T): void {
  const index = arr.indexOf(value);
  if (index === -1) return;

  arr.splice(index, 1);
}

export function getIsSuccess(
  revolutionsC: number,
  risk: number,
  votes: (boolean | null)[],
): boolean {
  const pos = revolutionsC % 1;

  return pos < risk
    ? false
    : votes[Math.floor(((1 - pos) * votes.length) / (1 - risk))] ??
    true;
}