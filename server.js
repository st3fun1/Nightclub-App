const http = require('http');
const path = require('path');
// pass over cross-origin HTTP request policy
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const app = express();
const request = require('request');
const mongoose = require('mongoose');
const Utilities = require('./server/utilities/utilities');
const dburi = 'mongodb://127.0.0.1:27017/nightclub';
const MainFactory = require('./server/factories/factory');
const authMiddleware = require('./server/middlewares/auth.middleware');
const PlaceRouter = require('./server/routes/place.route')();

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
app.use(authMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', PlaceRouter);

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'dist/index.html') || '');
});


const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log("SERVER STARTED!");
});

