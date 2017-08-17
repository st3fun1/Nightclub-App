const Place = require('../models/place.model');
const MainFactory = require('../factories/factory');
const jwtDecode = require('jwt-decode');
const mongoose = require('mongoose');


// TODO:
/**
 * FEATURES: 
 *     - popular clubs listing in user's area
 *     - chat for each club - using web socket
 *     - notifications when users subscribe or not
 *     - reset subscribtions after event ends
 */

exports.findAllPlacesWithGivenArr = function(req, res) {
     let c = 'stefan';
     if (c) {
        let body = [{"name":"Oscar Wilde Pub","rating":3.7,"photos":[{"height":900,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/102024903808669683296/photos\">Oscar Wilde Pub</a>"],"photo_reference":"CmRaAAAAwlod3ne_YHowc9LL7c3yktWdHaJ-hj5P9Du5TSFlByHv9V6dkClATO_bnxb1PXIwrv5c5umQJyVpdrzXtKVUHrn36Y_6GRicbfS1_6ougCK0r_PJE3YXay17QCg6BMC7EhCmu5tcMx6Rcq--xAYRBR1lGhRDLrTm4_4PPoit-6ih56V3MHnkOw","width":1350}],"address":"Strada Ștefan cel Mare 26, Suceava 720005, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png","peopleGoing":0,"city":"Suceava"},{"name":"La Fierarie - Pub BOEM","rating":4.3,"photos":[{"height":435,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/108185485835371865228/photos\">Ancaluiza Luca</a>"],"photo_reference":"CmRaAAAAGZwEAUHciy3LAgy5TYbE7NVz7UwvGfI-xGGHJ7e-lv_q3oacKmisQ4IQLkT_icOIQvY3J4bh4ZLlK3wg8se7ZD-4OKIZOdrq4ppbaQp_HDUSRiDvSIKTbsLQOrxnJ7wUEhA--7cbtELbX4felaXzt58pGhR18Vq5vjMQzc360I0NzFsrEAYXpg","width":480}],"address":"Strada Mărășești 27, Suceava 720181, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Poiana Club Suceava","rating":4.5,"address":"DC54, Poiana 727643, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Padrino Lounge","rating":2.8,"photos":[{"height":1280,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/100329258066916708091/photos\">Antonio Ursache</a>"],"photo_reference":"CmRaAAAAfEdoK9XnJpvArVKB7508G6vI7E-4rh5HbIQysCKCKZD2cv5gDkUG9A44tk2Jp8haHYxaicgVcq3xkZIc-GYrE4xUR6Lsda27LGT9QZwdyUUUIOQ6NMc9SVwS7U01CzqtEhBM1w1mFDK_D-AoPbUkjl7pGhRaHJjG95ueL9sPGWua6NKmgeNopQ","width":960}],"address":"Bloc Hotel, Strada Nicolae Bălcescu 4, Suceava 720002, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Shock","rating":1,"photos":[{"height":2268,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/103349292877394473891/photos\">PCH SUCEAVA FCD</a>"],"photo_reference":"CmRaAAAArtfOAMQGv7bh0AaHb6a_rTv_CmMYOCzI1dmitveVODNWuP1ZUgqaNEW8XWAIjuQuhXGAyj7LnOC2_RxeEBqPAmOCsXqx5fK3udpfMyukT6tKvbpqT3NNDwUxhqLOCoyKEhAw9V-E2padQ501ZKriDOn2GhQ5_VQxxYTPLQKwTudUyZeKtphidg","width":4032}],"address":"Suceava, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Bar SC Telerom SRL","rating":1,"address":"Strada Slatioarei, Suceava, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Bamboo Cafe Bar","rating":4.5,"photos":[{"height":2246,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/115010764419830117948/photos\">Radu Baran</a>"],"photo_reference":"CmRaAAAAHTiqxWtetWYm0_vbD2EOTtSHbmM6S0Z6q_ASqfsaOWsRL0wN5uFIa0pPH2ubVzNsO--ok50LJBOn0ZRIkyPDw7F0AoQsD23ZLlpr9L3-eurG7oGtgVv_pr8b9sK_aEN5EhB6T9cNkNkx5G-sWiLlakUUGhSHaX4WoTpBox0D03W_LIIuXQkCxg","width":3992}],"address":"Strada Stațiunii, Suceava, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Bar","rating":1,"address":"18-, Bloc E66, Bulevardul George Enescu 22, Suceava 720232, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Ana Bogdan","address":"Strada Păcii 19, Suceava 720101, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"La bibliotecă","rating":4.2,"photos":[{"height":4608,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/110518325321121085151/photos\">Silviu Aurelian Gramada</a>"],"photo_reference":"CmRaAAAAf--PyACX8CMmj3MYpTnWo38nYQ9-_hi60FTgFsfvX6lFD7In9nRXgztb072G-G3qoZzKftYUjk9rB6qKiqm4HTCAnTOxORms7z17C3pZ2OfCLIMB6Z46nYkhVZbYI4IEEhA4DU8dF4sdEl-2T-rIpgtCGhRwfI1KSh_4cdEYRs4q0BIwSQyJ8g","width":3456}],"address":"Bulevardul 1 Mai, Suceava, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Restaurant Casa Bucovineană Suceava","rating":4.2,"photos":[{"height":2048,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/111357470134330767265/photos\">Restaurant Casa Bucovineană Suceava</a>"],"photo_reference":"CmRaAAAAlYb6907PVGmSqrtH_3PjO5K1b4N14VR50LBWGo5cZUoOFry9v_ViQOLClwgwSvS89beFNDQSkf91m12iznZcgrjpliIwzB5XHkvCIg_gyrkJL2f5027Kse1Q4IC8bBU3EhAyV9JGl4VO35GDCrPGlnAeGhQrj7kaAtXFWG7aaM5ZLlob0RrSCA","width":2047}],"address":"Strada Petru Rareș 57, Suceava 727525, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Restaurant Centru Vechi","rating":4.5,"photos":[{"height":3936,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/107403505082578008249/photos\">Restaurant Centru Vechi</a>"],"photo_reference":"CmRaAAAALRffYxwuL9Gy5VIdDaTfqUX3fAkAePjGB4ZCDbK48nEMb5QwLjEHgSEEQ2d7YR3Y25HzUAiGAxx5mg6o_4VKvycUX8xy8nc11KjbsCV2i9TpQfaTnUrPApPjQ1-68BCdEhDMvBnZoUzOzbkWdsm-Wnp4GhQjicvzTr5WbtCNwoBJ7mf8_YEjYg","width":5801}],"address":"Strada Vasile Bumbac 3, Suceava 720003, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Hotel Balada","rating":4.6,"photos":[{"height":850,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/104494679091506162425/photos\">Hotel Balada</a>"],"photo_reference":"CmRaAAAAziHAQiZuvamiTNH8M-o7gW8DNMbGveH0xRnGl5ZrXPUYlzpGe1rSybCzOFZWCZISKY31_mGfGYvV5jdaDdusmzTIhHvCj66EcSh0AiktlPxd3bLaHq3ys9lFHiryTKGPEhCdPuan2p1V14MFrj6pcvBWGhSre7sY1D4Wflsh1VvEeRdD2W9_5w","width":1280}],"address":"Strada Mitropoliei nr. 5, Suceava 720035, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Sakura","rating":4.8,"photos":[{"height":800,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/108712772787484948012/photos\">Sakura</a>"],"photo_reference":"CmRaAAAAwHrVxNandV8g3wQHmT7XmBofwloU9EHAB9F1-5dW-lRy3q4eoR3fckgYsgT_ez8QfskvfZiTuPDa5gwBZ0KkFRrxIFMoXlPqNwQx5SKX5_vYFs_mqn0gYqIPWoZXRkBBEhCpBgBwUAHzAfFkgGFotFNXGhR9-KkEwJVjLWgAdyARqqEsWn3fMA","width":1200}],"address":"Strada Cireșoaia 1, Suceava 720217, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Hotel Albert","rating":3.8,"photos":[{"height":686,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/111105973523722146308/photos\">Hotel Albert</a>"],"photo_reference":"CmRaAAAAF-_p0yFTyWKwWzNagtkwwW61kCl5i-47IxAgG9Xye5PTjpLtSD3R0iLv_tTCxXpD-dKMvfc2Ay5Y0-jQASmxcD7GAV-C8Xa0NDwwKBXzGsMNTByTKiIIkssgn38_42NXEhCfQjOVPrin1WkHysLtK3tgGhSPco8bgt2lVjnSnCBVLo0TMfkx0w","width":690}],"address":"Bulevardul Sofia Vicoveanca, Suceava 720285, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Lorin","rating":3.5,"address":"DN29, Plopeni, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Studenteasca","rating":4,"photos":[{"height":2448,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/110214388973143629110/photos\">Mirela Mire</a>"],"photo_reference":"CmRaAAAAUjFQTj6Hhi_muRRVsQIlT18aP4ikQ9V_4VywDRpKhEkIsS6jwp1OGUFFFeiCzSBluyd8fpa3mnHK0nKDjRd0FZ9ewIYOXh9J-9mOlxDztiCx40taI2bHsTs-NPL5wO4PEhA6sXGwCH8DoB_i-5AykC-7GhR6WySVA3jMMpIpx7_jP4J90twRgA","width":3264}],"address":"Mărăşeşti, Suceava, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Souvlaki Akropoli \"Petru Rares\"","rating":4.4,"photos":[{"height":4032,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/111592233991179304415/photos\">Constantin Ciornei</a>"],"photo_reference":"CmRaAAAA_pa9E1a7Mdz3smJLWHMAU2tM5VdDp2jDpJzx6O1uGcwbZxGSK5BhRKaTqY1-F62pfXFBSyqTR3Uli0D0iSsV0vpqoXX4siiiTgXqfPWaAOrWNLmuW52Fx5Pihp9ZVHhaEhDkEPqdnYv_cluxvlQttr_8GhQD8nbgvTUA-oy6uZybT1gwhKodBQ","width":3024}],"address":"Strada Mihai Viteazul 21, Suceava 720059, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Crama cu Ştaif","rating":4.8,"photos":[{"height":3541,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/113512201922211774252/photos\">Crama cu Ştaif</a>"],"photo_reference":"CmRaAAAA__G9yShH95RP7mHA5pXAYjVLMmFDappXlBzK0aTaZGrtgfYU6KEoynriHSb7l6_AUWheNJUhOfv8eMY9ATi6Hnn8fjPaARMF6R5llfOLytqtibNrT8HqmgDqEDVRR1yuEhD_ZwJNo218ibsCgSPT-vfZGhTY4bD5SMAiZv8HVdvy3-W1j8hsKA","width":7340}],"address":"Strada Republicii 10 Suceava, Suceava 720071, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png","peopleGoing":0,"city":"Suceava"},{"name":"Music Pub","rating":4,"photos":[{"height":2592,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/117817743416522338374/photos\">Gion Gioni</a>"],"photo_reference":"CmRaAAAAVP3Y0WKhwLGzYSGAM0z7QIcnjJjWfQ4xsq7KpQ1VkcAtFOphhQoeoZho1mw9yqad8ZWAOd9EPDHfgPrjeO5ANQi9OoaixFCH0iwMgxiesSrOZ87SNInx3O-y7aaKLghCEhDgA7A-PburdBLen3DhMhe6GhQjCM6-P4Zu1JatuO-28-BDBhdJNw","width":1944}],"address":"Mihai Viteazul, Suceava, Romania","icon":"https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png","peopleGoing":0,"city":"Suceava"}];
        return res.json({places: body});        
     } else if (req.body && req.body.cityName) {
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
                    console.log("PLACES: ", places);
                    return res.json({places: places});
                } else {
                    console.log("PLACES: ", JSON.stringify(places));
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
                });
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