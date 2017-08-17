module.exports = class Config {
    constructor() {
    }
    get googlePlacesURI() {
        return 'https://maps.googleapis.com/maps/api/place/';
    }
    // TODO: move key to envinronment variable
    get googlePlacesAPIKey() {
        // return 'AIzaSyCEgPg35YC5JpCmQyP9hFrJHIRUpTFe5Yk';
        return 'AIzaSyBDNQbCndagB8NTJDzofibKXYEmvzceyK0';
        // return 'AIzaSyDaBPEQAkPAVHRk623mQAhn2T3ux9qgfyY';
    }
};