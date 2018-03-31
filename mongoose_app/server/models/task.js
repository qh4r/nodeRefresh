const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
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

module.exports = Task;