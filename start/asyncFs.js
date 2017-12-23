const fs = require('fs');

fs.readFilePromise = function(fileName) {
  return new Promise((resolve, reject) => {
    this.readFile(fileName, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  })
};

module.exports = fs;