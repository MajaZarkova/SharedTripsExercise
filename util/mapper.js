function mapErrors(err) {
    if (Array.isArray(err)) {
        return err
    } else if (err.name == 'ValidationError') {
        return Object.values(err.errors).map(e => ({ msg: e.message }));
    } else if (typeof err.message == 'string') {
        return [{ msg: err.message }];
    } else {
        return [{ msg: 'Request error' }];
    }
}

function tripViewModel(data) {
    data = {
        id: data._id,
        start: data.start,
        end: data.end,
        date: data.date,
        time: data.time,
        carImg: data.carImg,
        carBrand: data.carBrand,
        seats: data.seats,
        price: data.price,
        description: data.description,
        creator: userViewModel(data.creator),
        buddies: data.buddies.map(buddiesViewModel)
    }
    return data
}

function userViewModel(user) {
    return {
        id: user._id,
        email: user.email,
        gender: user.gender
    }
}

function buddiesViewModel(user) {
    return {
        id: user._id,
        email: user.email
    }
}
module.exports = {
    mapErrors,
    tripViewModel
} 