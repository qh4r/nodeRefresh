const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const message = "test message";
const bcrypt = require('bcryptjs');

const hash = SHA256(message).toString(); //unsalted

const data = {
  id: 23,
  name: 'test',
};
const salt = 'secretsalt';
const example = {
  data,
  hash: SHA256(JSON.stringify(data) + salt).toString(),
};

///hush unchanged as long as data does not change

const secret = 'asdasd';
const token = jwt.sign(data, secret);
console.log('token', token);

const decoded = jwt.verify(token, secret); // will throw if token or secret was altered
console.log('decoded', decoded);


//bcrypt example

const pass = "secretPass123asd";
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  console.log('hash ', hash);

  const result = await bcrypt.compare(pass, hash); // true/false
  console.log('result', result);
})();
