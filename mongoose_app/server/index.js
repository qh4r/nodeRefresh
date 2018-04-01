const app = require('./server')();
const PORT = 3000;

process.on('uncaughtException', (err) => {
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  process.exit(1);
});

app.listen(PORT, () => {
  console.log('listening on port %s!', PORT)
});