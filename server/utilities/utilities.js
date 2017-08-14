module.exports = class Utilities {

    constructor() {
    }
    parseJson(str) {
        try {
            let json = JSON.parse(str);
            return json;
        } catch(e) {
            return {};
        }
    }

};