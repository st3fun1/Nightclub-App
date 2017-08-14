const Place = require('../models/place.model');
const MainFactory = require('../factories/factory');
const jwtDecode = require('jwt-decode');
const mongoose = require('mongoose');

exports.findAllPlacesWithGivenArr = function(req, res) {
     if (req.body && req.body.cityName) {
        MainFactory.GooglePlaces.getClubsList(req.body.cityName, (err, body) => {
            if (err) {
                return res.json({error: 'Service error.'});
            }
            let parsedBody = MainFactory.Utilities.parseJson(body);
            let places = [];
            if (parsedBody) {
                places = parsedBody.results.map( (place) => {
                    let formattedPlace = {
                        name: place.name,
                        rating: place.rating,
                        photos: place.photos,
                        address: place.formatted_address,
                        icon: place.icon,
                        peopleGoing: 0,
                        city: req.body.cityName
                    };
                    return formattedPlace;
                });
            }
            Place.find({name: {$in: places.map( (place) => place.name)}}, (err, rs) => {
                if (err) {
                    return res.json({error: 'Server error.'});
                } else if (rs.length) {
                    places = places.map( (place) => {
                        let currently =  MainFactory.Utilities.getNumberOfPplGoing(rs, place.name);
                        let pplGoing = currently && currently.peopleGoing ? currently.peopleGoing.length : 0;
                        if (req.privateReq) {
                            let currentUserGoing =  pplGoing ? MainFactory.Utilities.checkIfUserIsGoing(currently.peopleGoing, req.decodedAuth.nickname) : false;
                            if (currentUserGoing) {
                                place.currentUserGoing = true;
                            }
                        }
                        place.peopleGoing = pplGoing ? pplGoing : place.peopleGoing;
                        return place;
                    });
                    return res.json({places: places});
                } else {
                    return res.json({places: places});
                }
            });

        });
    } else {
        return res.json({error: 'Service error.'});
    }
};
exports.subscribeToClub = function(req, res) {
     Place.findOneAndUpdate(
        {
            name: req.body.club.name
        },
        {
            $setOnInsert: {
                name: req.body.club.name,
                city: req.body.club.city,
            }
        },
        {
            upsert: true,
            new: true
        }
        ,
        (err, doc) => {
            if (err) {
                return res.json({error: 'Update failed'})
            } else {
                let peopleGoing = doc.peopleGoing;
                if (peopleGoing.length) {
                    return res.json({message: 'Succesfully subscribed!'});
                } else {
                    Place.findByIdAndUpdate(
                        {
                            _id: mongoose.Types.ObjectId(doc._id)
                        },
                        {
                            $addToSet: {
                                peopleGoing: {
                                    nickname: req.decodedAuth.nickname,
                                    name: req.decodedAuth.name
                                }
                            }
                        }, 
                        (err, raw) => {
                            if (err) {
                                return res.status(500).json({message: 'Internal server error!'});
                            } else {
                                return res.json({message: 'Succesfully subscribed!'});
                            }
                        }
                    );
                }
            }
        }
     );
};

exports.unsubscribeFromClub = function(req, res) {
    Place.findOneAndUpdate(
        {
            name: req.body.club.name
        },
        {
           $pull: {
               peopleGoing: {
                   nickname: req.decodedAuth.nickname,
                   email: req.decodedAuth.name
               }
           }
        },
        (err, doc, rs) => {
            if (doc) {
                 return res.json({message: 'Succesfully unsubscribed!'});
            }
            if(err) {
                return res.json({error: 'Deletion failed'});
            }
        }
    );
};