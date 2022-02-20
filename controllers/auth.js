const router = require('express').Router();
const { isGuest, isUser } = require('../middleware/guards');
const { register, login } = require('../services/userService');
const { mapErrors } = require('../util/mapper');

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', isGuest(), async (req, res) => {
    const { email, password, repass, gender } = req.body;

    try {

        if (email == '' || password.trim().length < 4) {
            throw new Error('Email is required and password must be at least 4 characters');
        }

        if (password != repass) {
            throw new Error('Passwords don\'t match');
        }

        const user = await register(email, password, gender);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        const errors = mapErrors(err);
        const data = { email }
        gender == 'female' ? data.female = 'checked' : data.male = 'checked';

        res.render('register', { data, errors })
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login Page' })
});

router.post('/login', isGuest(), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await login(email, password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        const errors = mapErrors(err);
        res.render('login', { data: { email: email }, errors })
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
})

module.exports = router;