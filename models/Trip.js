const { Schema, model, Types: { ObjectId } } = require('mongoose');

const IMAGE_PATTERN = /^https?:\/\/(.+)/

const tripSchema = new Schema({
    start: {
        type: String,
        required: [true, 'Start point is required'],
        minlength: [4, 'Starting point must be at least 4 characters long']
    },
    end: {
        type: String,
        required: [true, 'End point is required'],
        minlength: [4, 'End point must be at least 4 characters long']
    },
    date: { type: String, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },
    carImg: {
        type: String,
        required: [true, 'Image is required'],
        validate: {
            validator(value) {
                return IMAGE_PATTERN.test(value)
            },
            message: 'Image must be a valid URL'
        }
    },
    carBrand: { type: String, required: [true, 'Car brand is required'] },
    seats: { type: Number, required: [true, 'Seats are required'], min: 0, max: 4 },
    price: { type: Number, required: [true, 'Price is required'], min: 1, max: 50 },
    description: { type: String, required: [true, 'Description is required'], minlength: [10, 'Description must be at least 10 characters'] },
    creator: { type: ObjectId, ref: 'User' },
    buddies: { type: [ObjectId], ref: 'User' }
})

const Trip = model('Trip', tripSchema);
module.exports = Trip;