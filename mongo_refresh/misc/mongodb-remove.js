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

    //delete many -- can use deleteOne to delete first elemnt
    try {
      const result = await promisifyQuery((handler) => {
        db.collection('Tasks').deleteMany({text: /.*stuff.*/}, handler);
      });

      console.log("TASKS remove: ",JSON.stringify(await result, undefined, 2)); // ops contains returned object
    } catch (e) {
      console.error("something went wrong", err);
    }

    // QUERYING WITH FILTER
    try {
      const result = await promisifyQuery((handler) => {
        // find one and delete returns deleted element (in opposite to delete one)
        db.collection('Users').findOneAndDelete({location: 'USA'}, handler);
      });

      console.log("USERS: ", JSON.stringify(await result, undefined, 2)); // ops contains returned object
    } catch (e) {
      console.error("something went wrong", err);
    }

    client.close();
  } catch (err) {
    console.error('failed connecting', err);
  }
})();
