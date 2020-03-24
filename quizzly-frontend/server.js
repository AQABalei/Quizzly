require('dotenv').config();
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');

var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var session = require('express-session');
// var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it

var isDeveloping = process.env.NODE_ENV !== 'production';
//const port = process.env.PORT || 4100;
const port = 3000;
var app = express();

// app.use(cookieParser());
// app.use(expressSession({secret:'somesecrettokenhere'}));
// app.use(bodyParser());
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', function(req, res) {
  var user = {
    email: req.body.email,
    facultyId: req.body.facultyId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    id: req.body.id,
    school: req.body.school,
    type: req.body.type
  };

  req.session.regenerate(function() {
    req.session.user = user;
    req.session.save();
    res.json(req.session.user);
  });
});

app.post('/logout', function(req, res) {
  req.session.destroy(function() {
    console.log("good logout");
    req.session = null;
    res.json({success: "good logout"});
  });

});

app.post('/session', function(req, res) {
  if(req.session.user) {
    res.json(req.session.user);
  } else {
    res.json(null);
  }
});

app.post('/sms', function(req, res) {
  client.sendMessage({
    to: req.body.phone, // Any number Twilio can deliver to
    from: '+13122486888', // A number you bought from Twilio and can use for outbound communication
    body: req.body.message // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.from); // outputs "+14506667788"
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
});

if (isDeveloping) {
  console.log("DEV MODE ACTIVATED");
  console.log(process.env.DEV_ROOT_URL);
  var compiler = webpack(config);
  var middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'public',
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  var publicPath = path.resolve(__dirname, 'public');
  // We point to our static assets
  app.use(express.static(publicPath));

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'public/index.html')));
    res.end();
  });
} else {
  console.log("PROD MODE ACTIVATED");
  console.log(process.env.PROD_ROOT_URL);
  app.use(express.static(__dirname + '/public'));
  // app.use(express.static(__dirname + '/bower_components'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
