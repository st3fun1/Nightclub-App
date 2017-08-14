const GooglePlaces = require('../controllers/google-places');
const Config = require('../utilities/config');
const Utilities = require('../utilities/utilities');

class MainFactory {

    constructor() {
        this.Config = new Config();
        this.Utilities = new Utilities();
        this.GooglePlaces = new GooglePlaces(this.Config);
    }

}

module.exports = new MainFactory();