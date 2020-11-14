export const dropRight = (arr, n = 1) => (n && arr.slice(0, -n)) || arr;

export const groupBy = (arr, by) => arr.reduce((r, a) => {
  r[a[by]] = [...r[a[by]] || [], a];
  return r;
}, {});

export const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

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

// Ref: https://stackoverflow.com/a/10601315/8271526
export function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}