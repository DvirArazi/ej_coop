// export function makeEqual<T>(target: T, value: T) {
//   for (const key in value) {
//     target[key] = value[key];
//   }
// }



export function findIndexN<T>(
  arr: Array<T>,
  predicate: (value: T, index: number) => boolean,
): number | undefined {
  const index = arr.findIndex(predicate);

  return index != -1 ? index : undefined;
}