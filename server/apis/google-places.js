const request = require('request');
const fs = require('fs');

module.exports = class GooglePlaces {
    constructor(config, queryStr = 'nightclubs%20in%20') {
        this.queryStr = queryStr;
        this.reqURI = '';
        this.googlePlacesURI = config.googlePlacesURI;
        this.googlePlacesTxtSearchURI = config.googlePlacesURI + 'textsearch/json?';
        this.googlePlacesAPIKey = config.googlePlacesAPIKey;
    }
    getClubsList(cityName, cb) {
        this.setNewReqURI(cityName);
        request(this.reqURI, (err, resp, body) => {
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

    getPhoto(ref, maxWidth, clubName, cb) {
        let reqURI = this.googlePlacesURI + 'photo?maxwidth=' + maxWidth + '&photoreference=' + ref + '&key=' + this.googlePlacesAPIKey;
        let filePath = `/images/${clubName}-${+new Date()}.jpg`;
        let stream = request(reqURI).pipe(fs.createWriteStream(__dirname + filePath));
        stream.on('finish', () => {
            cb(null, filePath);
        });

        stream.on('error', (error) => {
            cb(true, null);
        });
    }

    setNewReqURI(cityName) {
        this.reqURI = `${this.googlePlacesTxtSearchURI}query=${this.queryStr}${cityName}&key=${this.googlePlacesAPIKey}`;
    }

    saveImage(resp) {
        resp.pipe(fs.createWriteStream(__dirname + '/images/image.png'));
    }
};