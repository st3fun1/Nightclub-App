const http = require('http');
const path = require('path');
// pass over cross-origin HTTP request policy
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtDecode = require('jwt-decode');
const app = express();
const request = require('request');
const mongoose = require('mongoose');
const Utilities = require('./server/utilities/utilities');
const dburi = 'mongodb://127.0.0.1:27017/nightclub';
const Place = require('./server/models/place.model');
const MainFactory = require('./server/factories/factory');

let promise = mongoose.connect(dburi, {
    useMongoClient: true
});

var authCheck = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://quintrix.eu.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  aud: 'https://quintrix.eu.auth0.com/userinfo',
  issuer: 'https://quintrix.eu.auth0.com/',
  algorithms: [ 'RS256' ]
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use( (req, res, next) => {
    next();
});
app.post('/public/nightclubs', (req, res) => {
    if (req.body && req.body.cityName) {
        MainFactory.GooglePlaces.getClubsList(req.body.cityName, (err, body) => {
            if (err) {
                return res.json({error: 'Service is down'});
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
                        let currently =  getNumberOfPplGoing(rs, place.name);
                        let pplGoing = currently && currently.peopleGoing ? currently.peopleGoing.length : 0;
                        // TODO: private listing for logged in user
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
        return res.json({places: []});
    }
});

app.post('/private/nightclubs', authCheck, (req, res) => {
     let decodedAuth = jwtDecode(req.headers.authorization);
     if (req.body && req.body.cityName) {
        MainFactory.GooglePlaces.getClubsList(req.body.cityName, (err, body) => {
            if (err) {
                return res.json({message: 'Service is down'});
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
                        let currently =  getNumberOfPplGoing(rs, place.name);
                        let pplGoing = currently && currently.peopleGoing ? currently.peopleGoing.length : 0;
                        // TODO: private listing for logged in user
                        let currentUserGoing =  pplGoing ? checkIfUserIsGoing(currently.peopleGoing, decodedAuth.nickname) : false;
                        if (currentUserGoing) {
                            place.currentUserGoing = true;
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
        return res.json({places: []});
    }
});

function getNumberOfPplGoing(list, currentClubName) {
    return list.find( (el) => el.name === currentClubName);
}

function checkIfUserIsGoing(list, nickname) {
    let foundUser = list.find( (el) => el.nickname === nickname);
    return foundUser ? true : false;
}

app.post('/private/nightclubs/subscribe', authCheck, (req,res) => {
    let decodedAuth = jwtDecode(req.headers.authorization);
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
    , (err, doc) => {
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
                            nickname: decodedAuth.nickname,
                            name: decodedAuth.name
                        }
                    }
               }, (err, raw) => {
                    if (err) {
                        return res.status(500).json({message: 'Internal server error!'});
                    } else {
                        return res.json({message: 'Succesfully subscribed!'});
                    }
               });
           }
        }
    });
});

app.post('/private/nightclubs/unsubscribe', authCheck, (req, res) => {
    let decodedAuth = jwtDecode(req.headers.authorization);
    Place.findOneAndUpdate(
        {
            name: req.body.club.name
        },
        {
           $pull: {
               peopleGoing: {
                   nickname: decodedAuth.nickname,
                   email: decodedAuth.name
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
    )
});

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'dist/index.html') || '');
});


const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log("SERVER STARTED!");
});

