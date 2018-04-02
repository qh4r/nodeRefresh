const mongoose = require('mongoose');
const validator = require('validator');

// !! need to use Schema constructor to customize toJSON !!
const User = mongoose.model('User', new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }],
}, {
  // customize data returned by toJson call
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.token;
      return ret;
    }
  }
}));

module.exports = User;