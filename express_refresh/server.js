const express = require('express');
const path = require('path');
const app = express();

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

// catch all not matching before
app.get('*', (req, res) => {
  let makeResponse = (content) => `<h1>query params:</h1><ul>${content}</ul>`;
  const content = Object.keys(req.query).map(key => `<li>${key} -> ${req.query[key]}</li>`).join('') || 'none';
  console.log(req.query);
  res.send(makeResponse(content));
});

app.listen(3000);