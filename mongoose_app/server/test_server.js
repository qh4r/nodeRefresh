const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // auto trims strings
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
});

const exampleTodo = new Todo({
  text: "proper one",
});

(async () => {
  try {
    // persistence
    const result = await exampleTodo.save();
    console.log("SAVED!", result);

    // fetch
    const results = await Todo.find();

    // Deleting with QUERIES
    //await Todo.where('completedAt').exists(false).deleteMany();
    console.log("found: ", results);
  } catch(e) {
    console.log("something went wrong", e.message)
  }

})();