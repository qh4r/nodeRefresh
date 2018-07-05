const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const SECRET = 'its a secret';
const bcrypt = require('bcryptjs');

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

UserSchema.methods.authenticate = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.removeToken = function (token) {
    return this.update({
        $pull: {
            tokens: {
                token,
            }
        }
    })
};

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    return next();
});

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

UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({
        email,
    });
    const result = (user && await user.authenticate(password));
    if (!result) {
        throw new Error('no match');
    }
    return user;
}
// !! need to use Schema constructor to customize toJSON !!
const User = mongoose.model('User', UserSchema);

module.exports = User;