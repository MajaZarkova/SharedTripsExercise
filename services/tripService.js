const Trip = require('../models/Trip');
const { tripViewModel } = require('../util/mapper');

async function createTrip(data, userId) {
    let trip = new Trip(data);

    const newTrip = await trip.save();
    return tripViewModel(newTrip);
}

async function getTrips() {
    const trips = await Trip.find({});

    return trips.map(tripViewModel);
}

async function getUsersTrips(id) {
    return await Trip.find({ creator: id }).lean();
}

async function getOneTrip(id) {
    const trip = await Trip.findById(id).populate('creator', 'email gender').populate('buddies', 'email');

    if (trip) {
        return tripViewModel(trip);
    } else {
        throw new Error('Trip doesn\'t exist')
    }
}

async function editTrip(id, data) {
    const trip = await Trip.findByIdAndUpdate(id, data, { runValidators: true });
}

async function deleteTrip(id) {
    await Trip.findByIdAndDelete(id);
}

async function joinTrip(tripId, userId) {
    const trip = await Trip.findById(tripId);

    if (trip.buddies.includes(userId)) {
        throw new Error('User already is part of the trip!');
    }

    trip.buddies.push(userId);
    trip.seats--;
    await trip.save();
}

module.exports = {
    createTrip,
    getTrips,
    getOneTrip,
    editTrip,
    deleteTrip,
    joinTrip,
    getUsersTrips
}