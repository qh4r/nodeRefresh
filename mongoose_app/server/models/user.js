const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const SECRET = 'its a secret';

const UserSchema = new mongoose.Schema({
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
      delete ret.tokens;
      return ret;
    }
  },
});

UserSchema.methods.generateToken = function () {
  const access = 'auth';
  const token = jwt.sign({
    _id: this._id.toHexString(),
    access,
  }, SECRET).toString();
  this.tokens.push({
    access,
    token
  });

  return this.save()
             .then(() => {
               return token;
             });
};

UserSchema.statics.findByToken = function (token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return this.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth',
    });
  } catch (e) {
    return Promise.reject("invalid token");
  }
};

// !! need to use Schema constructor to customize toJSON !!
const User = mongoose.model('User', UserSchema);

module.exports = User;