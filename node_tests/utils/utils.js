const add = (a, b) => {
  return a + b;
};

const asyncAdd = (a, b, cb) => {
  setTimeout(() => {
    return cb(a + b);
  }, 1500);
}

module.exports = {
  add,
  asyncAdd
};