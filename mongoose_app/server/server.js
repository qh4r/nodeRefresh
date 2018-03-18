const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
  },
  completedAt: {
    type: Number,
  },
});

const exampleTodo = new Todo({
  text: "first on list",
});

(async () => {
  try {
    // persistence
    //const result = await exampleTodo.save();
    //console.log("SAVED!", result);

    // fetch
    const results = await Todo.find();
    console.log("found: ", results);
  } catch(e) {
    console.log("something went wrong", e)
  }

})();