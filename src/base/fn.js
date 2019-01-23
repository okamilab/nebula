export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const readFile = (file) => {
  return new Promise((resolve, _) => {
    var fr = new FileReader();
    fr.onload = resolve;
    fr.readAsArrayBuffer(file);
  });
};

export const getAddress = (address = '', reveal = 0) => {
  return address.substring(0, 2 + reveal * 2) || '0x';
}