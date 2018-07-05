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

    app.delete('/tasks/:taskId', (req, res, next) => {
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
            if (req.body.completed) {
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
            .then(result => user.generateToken())
            .then(token => {
                res.header('x-auth', token).json(user)
            })
            .catch(next);
    });

    app.get('/users', authenticate, (req, res, next) => {
        User.find({})
            .then(result => res.json(result.map(x => x.toJSON())))
            .catch(next);
    });

    app.get('/users/me', authenticate, (req, res, next) => {
        res.json(req.user);
    });

    app.post('/users/login', (req, res, next) => {
        const {email, password} = req.body;
        return User.findByCredentials(
            email,
            password
        ).then(async user => res.header('x-auth', await user.generateToken()).json(user))
                   .catch(() => {
                       next({
                           status: 403,
                           message: 'wrong username or password',
                       })
                   });
    });

    app.delete('/users/me', authenticate, (req, res, next) => {
        req.user.removeToken(req.token)
           .then(() => res.status(200).send())
           .catch((e) => {
               console.log();
               next()
           });
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

function authenticate(req, res, next) {
    const token = req.header('x-auth');

    User.findByToken(token)
        .then(user => {
            if (!user) {
                return next({
                    status: 401,
                    message: "unauthorised"
                });
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch(() => next({
            status: 401,
            message: "unauthorised"
        }));
}

module.exports = appFactory;