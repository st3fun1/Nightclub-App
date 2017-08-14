// TODO: move paths to a separate dir
const jwtDecode = require('jwt-decode');
const securedPaths = [
                        '/api/private/nightclubs', 
                        '/api/private/nightclubs/subscribe', 
                        '/api/private/nightclubs/unsubscribe'
                     ];
function checkIfPathIsSecured(path) {
    return securedPaths.find( (el) => el === path);
}
module.exports = function(req, res, next) {
    if (req.headers.authorization &&  checkIfPathIsSecured(req.path)) {
        let decodedAuth = jwtDecode(req.headers.authorization);
        req.privateReq = true;
        req.decodedAuth = decodedAuth;
        console.log("req: ", req.privateReq, req.decodedAuth);
    }
    next();
};