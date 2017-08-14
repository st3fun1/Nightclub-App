const express = require('express');
const app = express();
const router = express.Router();
const PlaceController = require('../controllers/place.controller');

const route = function() {
    router.route('/public/nightclubs').post(PlaceController.findAllPlacesWithGivenArr);
    router.route('/private/nightclubs').post(PlaceController.findAllPlacesWithGivenArr);
    router.route('/private/nightclubs/subscribe').post(PlaceController.subscribeToClub);
    router.route('/private/nightclubs/unsubscribe').post(PlaceController.unsubscribeFromClub);
    
    return router;
};

module.exports = route;