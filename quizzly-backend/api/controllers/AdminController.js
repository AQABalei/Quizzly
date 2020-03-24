/**
 * AdminController
 *
 * @description :: Server-side logic for managing Answers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  makeOneProfessor: function(req, res) {
    var data = req.params.all();
    if (data.email === undefined)  {
        return res.status(400).send('Bad Request!')
    }
    Professor.findOne({email: data.email}).exec(function(err, user) {
        if (err || user === undefined) {
            return res.status(500).send('Internal server error.')
        }
        user.type = 'PROFESSOR'
        user.save((e)=>{
        })
    })

/*    Answer.destroy({id: data.ids}).exec(function(err, answers) {
      res.json(answers);
    });*/
  },

  denyOneProfessor: function(req, res) {
    var data = req.params.all();
    if (data.email === undefined)  {
        return res.status(400).send('Bad Request!')
    }
    Professor.destroy({email: data.email}).exec(function(err, user) {
        if (err || user === undefined) {
            return res.status(500).send('Internal server error.')
        }
    })
  },

  getPending: function(req, res) {
    Professor.find({type: "PROFESSOR_PENDING"}).exec(function(err, users){
        if (err) {
            return res.status(500).send
        }
        resData = users.map((usr) => {
            let _n = {
                email: usr.email
            }
            return _n
        })
        return res.json(resData)
    })
  }
};
