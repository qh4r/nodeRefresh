const {getArgs, getParsedArgs} = require('./get-arguments');
const os = require('os'); // local os info
const fs = require('./asyncFs');
const readline = require('readline');
const yargs = require('yargs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// encodeURIComponent useful for sending data in url
const urlData = encodeURIComponent("some message you want to send :F");
console.log(urlData);

//console.log(os.cpus());
//console.log(os.endianness());

fs.readFilePromise('./app.js')
  .then(x => x.toString())
  .then(console.log);

// fun stuff you can do with YARGS !
// THERE CAN BE MULTIPLE COMMANDS
const args = yargs
  .command('add', 'Add something', {
    title: {
      describe: 'title of what you are adding',
      demand: true, // will not run if --title not passed
      alias: 't',
    }
})
  .help() // prints help on --help
  .argv;


// you can debug by running node inspect [FILE]
// can run commands or use chrom dev tools
// to run CHROME DEVTOOL USE  node --inspect-brk
// enter after running inspect-brk mode - chrome://inspect/#devices
// can also run inspect with nodemon
(async () => {
  while(true) {
    const answer = await new Promise((res) => {
      rl.question('q zeby skonczyc\t', (answer) => {
        res(answer);
      })
    });
    console.log(`\n\t${answer}`);
    if(answer === 'q') {
      process.exit(0);
    }
  }
})();
