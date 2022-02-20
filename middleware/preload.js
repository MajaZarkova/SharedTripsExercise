const tripService = require('../services/tripService');

function preload() {
    return async function (req, res, next) {
        const id = req.params.id;
      
        const data = await tripService.getOneTrip(id)
        res.locals.trip = data;

        next();
    }
}

module.exports = preload;