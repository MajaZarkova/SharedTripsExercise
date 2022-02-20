const { isUser } = require('../middleware/guards');
const { getUsersTrips } = require('../services/tripService');
const { mapErrors } = require('../util/mapper');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

router.get('/profile', isUser(), async (req, res) => {
    const trips = await getUsersTrips(req.session.user._id);
    res.locals.user.trips = trips
    res.locals.user.tripsCount = trips.length;

    try {
        res.render('profile', { title: 'User\'s Profile' });
    } catch (error) {
        const errors = mapErrors(error);
        res.render('home', { title: 'Home page', errors });
    }
});

module.exports = router