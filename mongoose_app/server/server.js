const {promisify} = require('util');
const {mongoose} = require('./db/db');
const User = require('./models/user');
const Task = require('./models/task');
const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;

function appFactory() {
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

  app.get('/tasks', (req, res, next) => {
    Task.find({})
        .then(tasks => {
          res.json(tasks);
        })
        .catch(next);
  });

  app.param('taskId', async (req, res, next, taskId) => {
    try {
      if (!ObjectId.isValid(taskId)) {
        next({
          status: 403,
          message: "id is not valid",
        })
      }
      const result = await Task.where({_id: taskId}).findOne();
      if (result) {
        req.task = result;
        return next();
      }
      return next({
        status: 404,
        message: "not found",
      })
    } catch (e) {
      next(e);
    }
  });

  app.get('/tasks/:taskId', (req, res) => {
    res.json({
      ...req.task.toJSON(),
    })
  });

  app.del('/tasks/:taskId', (req, res, next) => {
    req.task.remove()
       .then(() => {
         res
           .status(204)
           .send();
       })
  });

  app.patch('/tasks/:taskId', (req, res, next) => {
    if (req.body.text) {
      req.task.set({
        text: req.body.text
      });
    }

    if (req.body.completed !== undefined) {
      if(req.body.completed) {
        req.task.set({
          completed: true,
          completedAt: new Date().getTime(),
        })
      } else {
        req.task.set({
          completed: false,
          completedAt: null,
        })
      }
    }

    req.task.save({new: true})
       .then(task => {
         res.json({
           ...task.toJSON(),
         })
       })
       .catch(next);

  });

  // USERS
  app.post('/users', (req, res, next) => {
    const {email, password} = req.body;
    const user = new User({email, password});
    user
      .save()
      .then(result => res.json(result.toJSON()))
      .catch(next);
  });

  app.get('/users', (req, res, next) => {
    User.find({})
      .then(result => res.json(result.map(x => x.toJSON())))
      .catch(next);
  });

  app.use((req, res, next) => {
    return next({
      status: 404,
      message: 'not found',
    })
  });

  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json(err);
  });
  return app;
}

module.exports = appFactory;