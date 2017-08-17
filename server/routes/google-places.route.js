const express = require('express');
const app = express();
const GooglePlacesController = require('../controllers/google-places.controller');
const router = express.Router();

module.exports = function() {

    router.route('/public/photo/:clubName').get(GooglePlacesController.getPhoto);

    return router;
}