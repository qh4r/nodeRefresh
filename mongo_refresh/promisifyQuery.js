module.exports = {
  promisifyQuery: function promisifyQuery(cb) {
    return new Promise((res, rej) => {
      cb((err, result) => {
        if (err) {
          return rej(err);
        }
        res(result);
      })
    })
  }
};