export const dropRight = (arr, n = 1) => (n && arr.slice(0, -n)) || arr;

export const groupBy = (arr, by) => arr.reduce((r, a) => {
  r[a[by]] = [...r[a[by]] || [], a];
  return r;
}, {});
