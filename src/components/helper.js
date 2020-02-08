export const dropRight = (arr, n = 1) => (n && arr.slice(0, -n)) || arr;

export const groupBy = (arr, by) => arr.reduce((r, a) => {
  r[a[by]] = [...r[a[by]] || [], a];
  return r;
}, {});


export const getRandomData = (l = 10, type) => {
  let result = [];
  let date = new Date().getTime();
  for (let i = 0; i < l; i++) {
    const x = type ? date : i;
    const y = Math.abs(Math.random());
    result.push([x, y]);
    date += 662000;
  }
  return [...result];
}
