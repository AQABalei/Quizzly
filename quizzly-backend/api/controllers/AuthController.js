/**
 * CourseController
 *
 * @description :: Server-side logic for managing Courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
var password = require('password-hash-and-salt');

module.exports = {
  login: function(req, res) {
    var data = req.params.all();

    // Ensure email and password fields exist
    if(!data.email || !data.password) { return res.status(400).send({error: 'Bad request!'}); }

    // Find the user
    return Promise.all([
      Professor.findOne({email: data.email}).populateAll(),
      Student.findOne({email: data.email}).populateAll()
    ]).spread(function(professor, student){
      sails.log("professor", professor);
      sails.log("student", student);
      var user = {};
      if(professor) {
        user = professor;
      } else if(student) {
        user = student;

        console.log('STUDENT LOGGING IN');
        console.log('student', student);
        console.log('data.mobile', data.mobile);

        if(data.mobile) {
          console.log("Mobile data exists: ", data.mobile)
          Device.handleStudentLogin(student, data.mobile);
        }

      } else {
        return res.status(400).send({error: 'That user was not found!'});
      }

      // check if password is correct
      return password(data.password).verifyAgainst(user.password, function(err, verified){
        if(err || !verified) { return res.status('401').send({error: 'Not Authorized.'}); }

        // remove password from payload
        delete user.password;

        // Encode JWT
        return JWT.encode(user, function(err, jwt){
          if(err || !jwt) { return res.status(400).send({error: 'Error occured in logging in.'}) }
          // Set JWT as cookie for web and return the token for mobile
          console.log("jwt", jwt);
          return res.cookie('jwt', jwt, { httpOnly: true}).json({jwt: jwt, user: user});
        });
      });
    }).catch(function(err){
      sails.log.error(err);
      sails.log.debug("error encountered in logging in");
    }).done(function(){
      sails.log.debug("login promise call is done");
    });
  },

  user: function(req, res) {
    return res.json(req.user);
  },
  session: function(req, res) {
    return res.json(req.user);
  },
  signup: function(req, res) {
    var data = req.params.all();
    sails.log.debug(data);
    var UserType = {};
    if(data.isProfessor == 'true' || data.isProfessor == 'YES') {
      sails.log.debug("signed up professor");
      UserType = Professor;
    } else {
      sails.log.debug("signed up student");
      UserType = Student;
    }

    password(data.password).hash(function(error, hash) {
      if(error) {
        throw new Error('Something went wrong!');
      }

      // Store hash (incl. algorithm, iterations, and salt)
      var newUser = {
        email: data.email,
        password: hash,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      UserType.create(newUser)
      .exec(function(err, user) {
        if(err) {
	  sails.log.debug(err);
          res.status(400).send('That user already exists!');
	  return;
        }

        // If signing up from mobile device and mobile data is available, register them with their device
        if(data.isProfessor != 'true' && data.isProfessor != 'YES') {
          if(data.mobile) {
            Device.handleStudentLogin(user, data.mobile);
          }
        }

        sails.log.debug("HELLO", user);
        user.password = "";
        delete user.password;

        // Encode JWT
        return JWT.encode(user, function(err, jwt){
          if(err || !jwt) { return res.status(400).send({error: 'Error occured in logging in.'}) }
          // Set JWT as cookie for web and return the token for mobile
          console.log("jwt", jwt);
          return res.cookie('jwt', jwt, { httpOnly: true}).json({jwt: jwt, user: user});
        });
      });
    });
  },
  logout: function(req, res) {
    return res.cookie('jwt', '', { httpOnly: true}).ok();
  },
  isStudentTest: function(req, res) {
    return res.json(req.user);
  },
  isProfessorTest: function(req, res) {
    return res.json(req.user);
  },
  isAdminTest: function(req, res) {
    return res.json(req.user)
  },
  isAuthenticatedTest: function(req, res) {
    return res.json(req.user);
  }
};
