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

    // uses mongodb update operators
    try {
      const result = await promisifyQuery((handler) => {
        // if we did not use set object would end up with completed field and nothing else
        db.collection('Tasks').findOneAndUpdate({completed: false}, {
          $set: {completed: true}
          }, {
          returnOriginal: false // if this was not set mongo would return old object
        }, handler);
      });

      console.log("TASKS remove: ",JSON.stringify(result, undefined, 2)); // ops contains returned object
    } catch (e) {
      console.error("something went wrong", err);
    }

    // QUERYING WITH FILTER
    try {
      const result = await promisifyQuery((handler) => {
        // increment age on first item by 1,
        // filter can not be null
        db.collection('Users').findOneAndUpdate({}, {$inc: {age: 1}}, {returnOriginal: false}, handler);
      });

      console.log("USERS: ", JSON.stringify(result, undefined, 2)); // ops contains returned object
    } catch (e) {
      console.error("something went wrong", e);
    }

    client.close();
  } catch (err) {
    console.error('failed connecting', err);
  }
})();
