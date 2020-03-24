/**
 * QuizController
 *
 * @description :: Server-side logic for managing Quizzes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var async = require("async");
 var Quiche = require("quiche");
 var Promise = require("bluebird");

module.exports = {
  duplicateQuiz: function(req, res) {
    var data = req.params.all();
    var quizIn = data.quiz;
    Quiz.create({title: quizIn.title, course: quizIn.course.id}).then(function(quiz){
      return Promise.each(quizIn.questions, function(original_question){
        return Question.create({text: original_question.text, type: original_question.type, quiz: quiz.id}).then(function(question){
          return Answer.find({question: original_question.id}).then(function(answers){
            return Promise.each(answers, function(answer){
              return Answer.create({text: answer.text, correct: answer.correct, option: answer.option, question: question.id})
              .then(function(answer){
                console.log(answer);
              });
            });
          });
        });
      }).then(function(){
        res.json(quiz);
      });
    });
  },
  destroyQuizzesByIds: function(req, res) {
    var data = req.params.all();
    Quiz.destroy({id: data.ids}).exec(function(err, quizzes) {
      res.json(quizzes);
    });
  },

  getQuizzesByQuizIds: function(req, res) {
    var data = req.params.all();
    Quiz.find({id: data.quizIds}).exec(function(err, quizzes) {
      res.json(quizzes);
    });
  },

  //Two parameters, quiz and email
  //this will return only the questions that have been answered by that user
  getQuizQuestions: function(req, res) {
    var data = req.params.all();
/*
    Student.findOne({email: data.student}).exec(function(err, s) {
      sails.log.debug("id: " + s.id);
      StudentAnswer.find({student: s.id, quiz: data.quiz}).populate('question').exec(function(err, answers) {
        sails.log.debug("answers: " + answers);
        var questions = [];
        var dict = {};
        answers.forEach(function(answer) {
          if(!(answer.question.id in dict)) {
            dict[answer.question.id] = 1;
            questions.push(answer.question);
          }
        });

        return res.send(200, questions);
      });
    });*/


    Quiz.findOne({id: data.id}).populate('questions').exec(function(err, quiz) {
      if(quiz.questions.length != 0) {
        return res.send(200, quiz.questions);
      }

      return res.json({
        error: "That quiz does not have any questions"
      });

    });
  },

  getJsonQuizQuestions: function(req, res) {
    var data = req.params.all();
    Quiz.findOne({id: data.id}).populate('questions').exec(function(err, quiz) {
      if(quiz.questions.length != 0) {
        return res.json({questions: quiz.questions});
      }

      return res.json({
        error: "That quiz does not have any questions"
      });

    });
  },

  //Used for power point I think?
  getQuizInfo: function(req, res) {
    var data = req.params.all();
    var response = [];
    var questions = [];

    async.series([
      function(callback) {
        Question.find({quiz: data.id}).exec(function(err, qs) {
          questions = qs;
          callback();
        });
      },

      function(callback) {
        async.each(questions, function(question, each_callback) {
          Answer.find({question: question.id}).exec(function(err, answers) {
            var question_json = {};
            question_json.question = question.text;
            question_json.quiz_id = data.id;
            question_json.answer = "answer";
            question_json.choices = [];
            answers.forEach(function (answer) {
              question_json.choices.push(answer.text);
            });

            question_json.time_limit = 20000;
            question_json.type = "multiple-choice";
            question_json.id = question.id;
            question_json.createdAt = question.createdAt;
            question_json.updatedAt = question.updatedAt;
            question_json.section_id = "0";

            response.push(question_json);

            each_callback();
          });
        }, function(err) {
          callback();
        });
      }

    ], function(err) {
      sails.log.debug(response);
      return res.send(200, response);
    });
  },

  //Failed powerpoint graph that may work with some more effort
  displayPowerPointGraph: function (req, res) {
    var data = req.params.all();

    StudentAnswer.find({question: data.question_id}).sort('answer ASC').exec(function(err, student_answers) {
      sails.log.debug(student_answers);
      var previous = -1;
      var i = 0;
      var num_answers = [];
      student_answers.forEach(function(student_answer) {

        if(previous == -1) {
          num_answers.push(1);
          previous = student_answer.answer;
        } else if(previous == student_answer.answer) {
          num_answers[i] = num_answers[i] + 1;
        } else {
          previous = student_answer.answer;
          i = i + 1;
          num_answers.push(1);
        }
      });

      //new
      Answer.find({question: student_answers[0].question}).sort('id ASC').exec(function(err, answers) {
        var labels = [];
        answers.forEach(function(answer) {
          labels.push(answer.text);
        });

        var bar = new Quiche('bar');
        bar.setWidth(625);
        bar.setHeight(480);
        bar.title = {
          'text': 'Some title!',
          'color': '000000',
          'size': 20,
          'align': 'c'
        };

        bar.setBarWidth(20);
        bar.setBarSpacing(80);
        bar.setLegendHidden();
        bar.setTransparentBackground();

        bar.addData(num_answers, 'Foo', 'FF0000');
        bar.addAxisLabels('x', labels);
    //    bar.addData([19, 19, 21, 14, 19, 11, 10, 18, 19, 30], 'Foo', 'FF0000');
    //    bar.addAxisLabels('x', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

        bar.setAutoScaling();
        var imageUrl = bar.getUrl(true);
        res.send(200, {
          graphUrl: imageUrl.split('%2B').join('+')
        });
      });
      //end new
    });
  },

  // This route is used by professors to ask quizzes params: (quizId as quiz, sectionId as section)
  ask: function(req, res) {
    sails.log.debug("Asking quiz (from QuizController)");
    var data = req.params.all();
    var quizId = data.quiz;
    var sectionId = data.section;

    if(!quizId || !sectionId) { return res.status(400).send('Bad Request!'); }

    // Find the question and section and make sure they exists
    return Promise.all([
      Quiz.findOne({id: quizId}).populate('questions'),
      Section.findOne({id: sectionId}).populate('course')
    ]).spread(function(quiz, section) {
      if(!quiz || ! section) { return res.status(400).send('Bad Request!'); }
      var questions = [];
      return Promise.each(quiz.questions, function(question) {
        // need questions with answers populated
        return Question.findOne(question.id).populate('answers')
          .then(function(question) {
            questions.push(question);
          });
      }).then(function() {
        // Need to create new object with the data
        // because of nested objects issue
        var quizData = {
          id: quiz.id,
          title: quiz.title,
          questions: questions,
          section: section
        };

        var quizKey = OpenQuizzes.add(quizData);
        sails.sockets.broadcast('section-'+section.id, 'quiz', {
          quizKey: quizKey
        });
        Push.pushToSection(section, {title: 'You have a new quiz!', quizKey: quizKey, type: 'quiz' });
        return res.json({quizKey: quizKey });
      });
    });
  },

  getOpenQuiz: function(req, res) {
    var data = req.params.all();
    var quizKey = data.quizKey;

    if(!quizKey) { return res.status(400).send('Bad Request!'); }

    var data = OpenQuizzes.get(quizKey);

    return (data) ? res.json(data) : res.status(404).send('Quiz not found!');

  },

  answer: function(req, res) {
    var data = req.params.all();
    var quizKey = data.quizKey;
    var questionId = data.question;
    var text = data.text;
    var answerId = data.answer;
    var student = req.user;

    if(!quizKey || (!answerId && !text) || !student) { return res.status(400).send('Bad Request'); }

    var quiz = OpenQuizzes.superGet(quizKey);

    if(!quiz ) { return res.status(401).send('Quiz Not Found!'); }

    var question = quiz.questions.filter(function(question){
      if(question.id == questionId){
        return true;
      }

      return false;
    });

    if(!question.length > 0) {
      return res.status(400).send('That question is not part of this quiz.');
    }

    question = question[0];

    var newQuestionData = {
      student: student.id,
      question: question.id,
      quiz: quiz.id,
      section: quiz.section.id,
      course: quiz.section.course.id,
      answer: answerId,
      text: text
    };

    var existingQuestionData = {
      student: student.id,
      question: question.id,
      quiz: quiz.id,
      section: quiz.section.id,
      course: quiz.section.course.id
    };

    StudentAnswer.findOrCreate(existingQuestionData, newQuestionData).exec(function(err, studentAnswer){
      if(err || !studentAnswer) { return res.status(400).send('something went wrong.'); }
      return res.json(studentAnswer);
    });
  },

  numberOfCorrectAnswersPerQuiz: function (req, res)
  {
    var data = req.params.all();
    var quizID = data.quizId;
    var questionsCorrectAndIncorrectForQuiz = {
      questionsCorrect: 0,
      questionsIncorrect: 0
    };
    StudentAnswer.find({quiz: quizID})
    .populate('question')
    .populate('answer')
    .then(function(studentAnswers) {
      for(var i = 0; i < studentAnswers.length; i++) {
        console.log(studentAnswers[i].answer);
        if(studentAnswers[i].question.type == "freeResponse") {
          questionsCorrectAndIncorrectForQuiz.questionsCorrect++;
        }
        else if(studentAnswers[i].answer.correct)
        {
          questionsCorrectAndIncorrectForQuiz.questionsCorrect++;
        }
        else
        {
          questionsCorrectAndIncorrectForQuiz.questionsIncorrect++;
        }
      }
    })
    .done(function() {
      var numberOfCorrectAnswers = {"Questions Correct":questionsCorrectAndIncorrectForQuiz.questionsCorrect};
      var arrayNumberOfCorrectAnswers = [];
      arrayNumberOfCorrectAnswers.push(numberOfCorrectAnswers);
      res.json(arrayNumberOfCorrectAnswers); //Send the array back
      console.log(arrayNumberOfCorrectAnswers);
    });
  },

  getQuizTableMetrics: function(req, res) {

		console.log("--------------getQuizTableMetrics");

		var quizID = req.param('quiz')
    var sectionID = req.param('section')

    // get quiz questions

    // get students in section

    // get answers from students in section
  }

};
