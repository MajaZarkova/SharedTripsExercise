const User = require('../models/User');
const { hash, compare } = require('bcrypt');

//TODO change parameters by requirements

async function register(email, password, gender) {
    const existing = await getUserByUsername(email)
    if (existing) {
        throw new Error('Email is taken');
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({
        email,
        hashedPassword,
        gender
    });

    await user.save();

    return user;
}

async function login(email, password) {
    const user = await getUserByUsername(email);

    if (!user) {
        throw new Error('Incorrect Email or Password');
    }

    const validPassword = await compare(password, user.hashedPassword);

    if (!validPassword) {
        throw new Error('Incorrect Email or Password');
    }

    return user;
}

async function getUserByUsername(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    return user;
}

module.exports = {
    register,
    login
}