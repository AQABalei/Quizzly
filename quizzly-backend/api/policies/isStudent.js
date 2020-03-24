/**
 * isStudent
 *
 * @module        :: Policy
 * @description   :: Allow a student
 *
 * @docs          :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = function(req, res, next) {
  var jwt = req.cookies.jwt || req.body.jwt ;
  if(!jwt) { return res.status(401).send('Not Authorized.'); }
  return JWT.decode(jwt, function(err, decoded){
    if(err || !decoded || decoded.type !== 'STUDENT') { return res.status(401).send('Not Authorized.'); }
    req.user = decoded;
    return next();
  });
};
