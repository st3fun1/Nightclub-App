const MainFactory = require('../factories/factory');
const fs = require('fs');
const path = require('path');

exports.getPhoto = function(req, res) {
    let folder = path.join(__dirname + '/../apis/images');
    if (req.params.clubName) {
        let decodedClubName = decodeURIComponent(req.params.clubName);
        getFileList(folder)
        .then((files) => {
            let fileName = checkIfFileExists(files, req.params.clubName);
            if (fileName) {
                return res.json({image: '/images/' + fileName});
            } else {
                if (req.query.ref) {
                    let width = req.query.width && !Number.isNaN(Number(req.query.width)) ? req.query.width : 400;
                    MainFactory.GooglePlaces.getPhoto(req.query.ref, width, decodedClubName, (err, image) => {
                        console.log("err: ", image);
                        if (err) {
                            return res.json({error: 'Service error.'});
                        } else {
                            return res.json({image});
                        }
                    });
                } else {
                    return res.status(422).json({error: 'Unprocessable Entity.'});
                }
            }
        })
        .catch( (error) => {
            return res.status(422).json({error: 'Unprocessable Entity.'});
        });
    } else {
        return res.status(422).json({error: 'Unprocessable Entity'});
    }
}

function getFileList(folder) {
    return new Promise( (resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        });
    });
}

function checkIfFileExists(files, clubName) {
    return files.find( (file) => file.indexOf(clubName) > -1);
}