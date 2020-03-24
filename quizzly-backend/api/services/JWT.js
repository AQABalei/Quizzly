/**
 *  JWT.js
 *
 *  @description  :: JSON Web Token interface used
 *  @methods      :: encode(data, callback) => given JS Object, turns it into a JWT
 *                :: decode(token, data)    => given a JWT, turns back into a JS Object
 */

var jwt = require('jsonwebtoken');
var secret = sails.config.session.secret;

module.exports = {
  encode: function(data, callback) {
    jwt.sign(data, secret, {}, function(err, token) {
      callback(err, token);
    });
  },

  decode: function(token, callback) {
    jwt.verify(token, secret, function(err, data){
      callback(err, data);
    });
  }
};
