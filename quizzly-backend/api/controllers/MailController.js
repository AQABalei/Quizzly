var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Godaddy',
  auth: {
    user: 'conner@redshepherd.com',
    pass: 'cf123'
  }
});

function sendMail(emailData, res) {
  return transporter.sendMail(emailData, function(error, info) {
    if(error) {
      res.status(400).send('Email failed');
    }
    res.ok("Success!");
  });
}

module.exports = {
  toQuizzly: function(req, res) {
    var data = req.params.all();

    var emailDataToQuizzly = {
      from: data.from,
      to: "connerfr@usc.edu",
      subject: data.subject,
      text: data.text,
      html: data.html ? data.html : data.text
    };

    sendMail(emailDataToQuizzly, res);
  },
  toUser: function(req, res) {
    var data = req.params.all();

    var emailDataToUser = {
      from: '"Quizzly Team" <frey.conner24@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html ? data.html : data.text
    };

    sendMail(emailDataToUser, res);
  }
};
