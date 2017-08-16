const request = require('request');

module.exports = class GooglePlaces {
    constructor(config, queryStr = 'nightclubs%20in%20') {
        this.queryStr = queryStr;
        this.reqURI = '';
        this.googlePlacesURI = config.googlePlacesURI;
        this.googlePlacesAPIKey = config.googlePlacesAPIKey;
    }
    getClubsList(cityName, cb) {
        this.setNewReqURI(cityName);

        request(this.reqURI, (err, resp, body) => {
            console.log("err, res, body", err, body);
            if (err) { 
                if (cb && typeof cb === 'function') {
                    return cb(err, null);
                }
            }
            if (body) {
                if (cb && typeof cb === 'function') {
                    return cb(null, body);
                }
            } else {
                return cb(true, null);
            }
        });
    }

    setNewReqURI(cityName) {
        this.reqURI = `${this.googlePlacesURI}query=${this.queryStr}${cityName}&key=${this.googlePlacesAPIKey}`;
    }
};