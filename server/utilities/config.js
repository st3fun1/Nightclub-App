module.exports = class Config {
    constructor() {
    }
    get googlePlacesURI() {
        return 'https://maps.googleapis.com/maps/api/place/textsearch/json?';
    }
    // TODO: move key to envinronment variable
    get googlePlacesAPIKey() {
        //return 'AIzaSyCEgPg35YC5JpCmQyP9hFrJHIRUpTFe5Yk';
        return 'AIzaSyBDNQbCndagB8NTJDzofibKXYEmvzceyK0';
    }
};