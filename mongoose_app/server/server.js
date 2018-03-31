const {promisify} = require('util');
const {mongoose} = require('./db/db');
const User = require('./models/user');
const Task = require('./models/task');

process.on('uncaughtException', (err) => {
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  process.exit(1);
});

const express = require('express');

const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/tasks', async (req, res, next) => {
  try {
    const task = new Task({
      text: req.body.text
    });
    const result = await task.save();
    return res.json({
      ...result.toJSON(),
    })
  }
  catch (e) {
    next({
      status: 403,
      message: e.message,
    });
  }
});

app.use((req, res, next) => {
  return next({
    status: 404,
    message: 'not found',
  })
})

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json(err);
});

app.listen(PORT, () => {
  console.log('listening on port %s!', PORT)
});