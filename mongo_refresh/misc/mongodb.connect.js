const {MongoClient, ObjectID} = require('mongodb');
const {promisifyQuery} = require('../promisifyQuery');

//ObjectID - allows you to create unique object ids on code side

console.log("object id: ", new ObjectID());

(async () => {
  try {
    const client = await new Promise((res, rej) => {
      MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) {
          return rej(err);
        }
        res(client);
      });
    });

    const db = client.db('todoList');
    console.log("connection ok ", db);

    try {
      const result = await promisifyQuery((handler) => {
        db.collection('Tasks').insertOne({
          text: "stuff to do 5",
          completed: false,
        }, handler);
      });

      console.log(JSON.stringify(result.ops, undefined, 2)); // ops contains returned object
    } catch (e) {
      console.error("something went wrong", err);
    }

    try {
      const result = await promisifyQuery((handler) => {
        db.collection('Users').insertOne({
          name: "Bart",
          age: 24,
          location: "USA"
        }, handler);
      });

      console.log(JSON.stringify(result.ops, undefined, 2)); // ops contains returned object
    } catch (e) {
      console.error("something went wrong", err);
    }

    client.close();
  } catch (err) {
    console.error('failed connecting', err);
  }
})();