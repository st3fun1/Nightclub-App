const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    name: String,
    city: String,
    peopleGoing: [{
        nickname: String,
        name: String
    }]
});

let Place = mongoose.model('Place', placeSchema);

module.exports = Place;