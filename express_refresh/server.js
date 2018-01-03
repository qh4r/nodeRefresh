const express = require('express');
const path = require('path');
const hbs = require('hbs');


// fn is a function that when triggered parses given helper body (template) with given data
hbs.registerHelper('list', function (items, options) {
  //return items.reduce((out, current) => `${out}${options.fn(current)}`, "");
  return items.map(elem => options.fn(elem)).join("\n");
});

// first arg is data passed to helper as argument
hbs.registerHelper('capitalize', text => text.toUpperCase());

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

const app = express();

app.set('view engine', 'hbs');

//custom middleware - middlewares are piped
app.use((req, res, next) => {
  // bad practice but proves all is working
  req.query.requestedAt =  new Date().toISOString();
  next();
});

// static_page will be available at ...:3000/static_page.html
app.use(express.static(path.join(__dirname, 'statics')));

app.get('/json', (req, res) => {
  res.send({
    name: "api response",
    data: {
      this: 1,
      will: 2,
      be: 3,
      send: "as json",
    },
    at: Date.now(),
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'This is about page',
    data: [
      {name: "test", amount: 5},
      {name: "stuff", amount: 20},
      {name: "rest", amount: 100},
    ]
  });
});

// another midleware that will only be hit if /json or /about are not
app.use((req, res, next) => {
  //throttles request
  setTimeout(() => {
    req.query.postDelay = new Date().toISOString();
    next()
  }, 1500);
});

// catch all not matching before
app.get('*', (req, res) => {
  let makeResponse = (content) => `<h1>query params:</h1><ul>${content}</ul>`;
  const content = Object.keys(req.query).map(key => `<li>${key} -> ${req.query[key]}</li>`).join('') || 'none';
  res.send(makeResponse(content));
});

app.listen(3000);