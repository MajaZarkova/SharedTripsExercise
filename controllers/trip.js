const router = require('express').Router();
const { isUser, isOwner } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { createTrip, getTrips, joinTrip, deleteTrip, editTrip } = require('../services/tripService');
const { mapErrors } = require('../util/mapper');

router.get('/trips', async (req, res) => {
    const trips = await getTrips();

    res.render('shared-trips', { title: 'Trips Page', trips })
})

router.get('/create', isUser(), (req, res) => {
    res.render('trip-create', { title: 'Offer Shared Trip' })
});

router.post('/create', isUser(), async (req, res) => {
    const trip = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        carImg: req.body.carImg,
        carBrand: req.body.carBrand,
        seats: req.body.seats,
        price: req.body.price,
        description: req.body.description,
        creator: req.session.user._id,
    }

    try {
        await createTrip(trip, req.session.user._id);
        res.redirect('/trips');
    } catch (error) {
        const errors = mapErrors(error);
        res.render('trip-create', { title: 'Offer Shared Trip', trip, errors });
    }
});

router.get('/details/:id', preload(), async (req, res) => {
    res.locals.trip.isOwner = res.locals.trip.creator.id == req.session.user?._id;
    res.locals.trip.hasJoined = res.locals.trip.buddies.find(x => x.id == req.session.user?._id) != undefined;
    res.locals.trip.hasSeats = res.locals.trip.seats > 0;
    res.locals.trip.hasUser = res.locals.hasUser;
    res.locals.trip.buddies = res.locals.trip.buddies.map(x => x.email).join(', ');

    res.render('trip-details', { title: 'Details Page' });
});

router.get('/join/:id', isUser(), preload(), async (req, res) => {
    const userId = req.session.user._id;
    const tripId = req.params.id;

    try {
        await joinTrip(tripId, userId);
        res.redirect(`/details/${tripId}`);
    } catch (error) {
        const errors = mapErrors(error);
        res.render('trip-details', { title: 'Details Page', errors })
    }
});

router.get('/delete/:id', isUser(), preload(), isOwner(), async (req, res) => {
    const tripId = req.params.id;

    try {
        await deleteTrip(tripId);
        res.redirect('/trips');
    } catch (error) {
        const errors = mapErrors(error);
        res.render('trip-details', { title: 'Details Page', errors })
    }
});

router.get('/edit/:id', isUser(), preload(), isOwner(), (req, res) => {
    res.render('trip-edit', { title: 'Edit Page' })
});

router.post('/edit/:id', isUser(), preload(), isOwner(), async (req, res) => {
    const trip = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        carImg: req.body.carImg,
        carBrand: req.body.carBrand,
        seats: req.body.seats,
        price: req.body.price,
        description: req.body.description
    }
    const id = req.params.id

    try {
        await editTrip(id, trip);
        res.redirect(`/details/${id}`);
    } catch (error) {
        const errors = mapErrors(error);
        trip.id = id;
        res.render('trip-edit', { title: 'Edit Page', trip, errors });
    }
})

module.exports = router;