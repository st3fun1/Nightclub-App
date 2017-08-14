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

    getNumberOfPplGoing(list, currentClubName) {
        return list.find( (el) => el.name === currentClubName);
    }

    checkIfUserIsGoing(list, nickname) {
        let foundUser = list.find( (el) => el.nickname === nickname);
        return foundUser ? true : false;
    }


};