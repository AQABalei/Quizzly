/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

var Promise = require('bluebird');

module.exports = function(req, res, next) {
  let jwt = null;

  if(req.cookies && req.cookies.jwt) {
    jwt = req.cookies.jwt;
  }

  if(req.body && req.body.jwt) {
    jwt = req.body.jwt;
  }

  if(!jwt) { return res.status(401).send('Not Authorized.'); }
  return JWT.decode(jwt, function(err, decoded){
    if(err || !decoded) { return res.status(401).send('Not Authorized.'); }
    req.user = decoded;
    return next();
  });
};
