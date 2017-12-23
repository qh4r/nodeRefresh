const fs = require('fs');
const yargs = require('yargs');

function getArgs() {
  return process.argv.slice(2);
}

// resolves -- and - prefixed args as key value
function getParsedArgs() {
  return yargs.argv;
}



module.exports = {
  getArgs,
  getParsedArgs,
};