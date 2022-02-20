const { Schema, model, Types: { ObjectId } } = require('mongoose');
//TODO: change Schema by the requirements

const EMAIL_PATTERN = /^([A-Za-z]+)@([A-Za-z]+)\.([A-Za-z]+)$/

const userSchema = new Schema({
    email: {
        type: String, required: [true, 'Email is required'],
        validate: {
            validator(value) {
                return EMAIL_PATTERN.test(value);
            },
            message: 'Email must be in the following format: mailboxname @ domainname'
        }
    },
    hashedPassword: { type: String, minlength: [4, 'Password must be at least 4 characters long'] },
    gender: { type: String },
    trips: { type: [ObjectId], ref: 'Trip' }
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;