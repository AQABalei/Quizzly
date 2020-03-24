/**
 * SectionController
 *
 * @description :: Server-side logic for managing Sections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var Promise = require('bluebird');

module.exports = {
  destroySectionsByIds: function(req, res) {
    var data = req.params.all();
    Section.destroy({id: data.ids}).exec(function(err, sections) {
      res.json(sections);
    });
  },
  getSectionByStudentAndCourse: function(req, res) { // needs {courseId, studentId}
    var data = req.params.all();

    Section.find({course: data.courseId}).populate("students").exec(function(err, sections) {
      var section = {};
      for(var i = 0; i < sections.length; ++i) {
        for(var j = 0; j < sections[i].students.length; ++j) {
          if(sections[i].students[j].id == data.studentId) {
            section = sections[i];
            break;
          }
        }
      }
      res.json(section);
    });
  },
  updateStudents: function(req, res) {
    var data = req.params.all();
    Section.update({id: data.sectionId}, {students: data.studentIds}).exec(function(err, section) {
      return Section.findOne({id: data.sectionId}).populate('students').exec(function(err, section) {
        res.json(section);
      });
    })
  },

  // getStatisticsForSectionQuiz: function(req, res) {
  // This route is used by students to subscribe to to their sections so that a professor can push questions to them.
  connect: function(req, res) {
    if(!req.isSocket) { return res.status(400).send('Bad Request'); }
    Student.findOne({id: req.user.id}).populate('sections').exec(function(err, student) {
      if (err || !student) {
        return res.status(400).send('Something went wrong.');
      }
      student.sections.map(function (section) {
        sails.sockets.join(req, 'section-' + section.id);
      });

      return res.ok();
    });
  },

  numberOfCorrectAnswersPerStudent: function(req, res) {
    var data = req.params.all();
    var sectionId = data.sectionId;
    var quizId = data.quizId;
    var allStudents = {};
    var correctStudentAnswers = {};
    Section.findOne({id: sectionId})
    .populate('students')
    .then(function(section){
      // console.log(section);
      for(var i = 0; i < section.students.length; i++)
      {
          allStudents[section.students[i].id] = {
            name: section.students[i].firstName, // Change to ID in future?
            correct: 0
          };
      }
      console.log(allStudents);
      StudentAnswer.find({section: sectionId, quiz:quizId})
        .populate('student')
        .populate('answer')
        .populate('question')
        .then(function(studentAnswers) {
          console.log(studentAnswers);
          console.log(sectionId);
          console.log(quizId);
          for(var i = 0; i < studentAnswers.length; i++)
          {
            var studentAnswer = studentAnswers[i];
            console.log(studentAnswer);
            if(studentAnswer.question.type == "freeResponse")
            {
              allStudents[studentAnswer.student.id].correct++;
            }
            else
            {
              if(studentAnswer.answer.correct)
              {
                allStudents[studentAnswer.student.id].correct++
              }
            }
          }
          console.log(allStudents);
        var allStudentsArray = [];
        for(var student in allStudents)
        {
          console.log(student);
          var studentQuizResult = {"Name": allStudents[student].name, "Questions Correct":allStudents[student].correct};
          allStudentsArray.push(studentQuizResult);
        }
        res.json(allStudentsArray);
      });
  });

    /*
    StudentAnswer.find({section: sectionId, quiz: quizId})
    .populate('question')
    .populate('student') //Take the ObjectId of the linked student model and replace it with the object corresponding to that ObjectId
    .populate('answer') ////Take the ObjectId of the linked answer model and replace it with the object corresponding to that ObjectId
    .then(function(studentAnswers) {
      console.log(studentAnswers);
      for(var i = 0; i < studentAnswers.length; i++) { //For each student answer corresponding to the quiz and section
        var studentAnswer = studentAnswers[i];
        if(correctStudentAnswers[studentAnswer.student.id] == undefined) { //If student is not in map
          correctStudentAnswers[studentAnswer.student.id] = { //Key: Student ID
            correct: 0, //Value: (Correct number of answers, First name)
            name: studentAnswer.student.firstName
          };
        }
        if(studentAnswer.question.type == "freeResponse") {
          correctStudentAnswers[studentAnswer.student.id].correct++;
        }
        else { //Student already in map
          if(studentAnswer.answer.correct) {  //If the student's answer is correct
            correctStudentAnswers[studentAnswer.student.id].correct++; //Increment the count of the number of correct answers it has in the value pair
          }
        }
      }
      var correctAnswers = []; //New array to put the value pairs in (exclude keys from map)
      for(var studentId in correctStudentAnswers) { //For each key or student in the map
        if(correctStudentAnswers.hasOwnProperty(studentId)) {
          var correctAnswer = {"Name": correctStudentAnswers[studentId].name, "Questions Correct":correctStudentAnswers[studentId].correct}; //Make a pair corresponding to the value pair in the map
          correctAnswers.push(correctAnswer); //Put it in the array
        }
      }
      res.json(correctAnswers); //Send the array back
    });
    */
  },

  numberOfCorrectAndIncorrectAnswersForStudent: function(req, res) {
    var data = req.params.all();
    var studentId = data.studentId;
    var courseId = data.courseId;
    var numQuestionsInQuiz = {};
    var numQuestionsArray = [];
    var PromiseArray = [];
    var numberOfCorrectAndIncorrectAnswers = {};
    var arrayNumberOfCorrectAndIncorrectAnswers = []; //New array to put the value pairs in (exclude keys from map)
    StudentAnswer.find({student:studentId})
    .populate('quiz')
    .populate('question')
    .populate('student')
    .populate('answer')
    .then(function(studentAnswers) {
      console.log(courseId);
      Quiz.find({course: courseId})
      .then(function(quizzes){
        console.log("here");
        console.log(quizzes);
        for(var i = 0; i < quizzes.length; i++){
          numQuestionsInQuiz[quizzes[i].title] = {
            quiz: quizzes[i].title,
            questions: 0
          };
          numQuestionsArray.push({
            name: quizzes[i].title,
            id: quizzes[i].id
          });
          numberOfCorrectAndIncorrectAnswers[quizzes[i].title] = {
            correct: 0,
            incorrect: 0,
            unanswered: 0
          };
        }
        Promise.each(numQuestionsArray, function(quiz, i){
          console.log(quiz);
          return Question.find({
  	        "quiz": quiz.id
    	    })
    	    .then(function (questions){
            numQuestionsInQuiz[quiz.name].questions = questions.length;
            console.log(questions.length);
            console.log(numQuestionsInQuiz[quiz.name].questions);
          });
        }).then(function(){

          console.log(studentAnswers);
          for(var i = 0; i < studentAnswers.length; i++) {
            var studentAnswer = studentAnswers[i];
            if(studentAnswer.question.type == "freeResponse") {
              numberOfCorrectAndIncorrectAnswers[studentAnswer.quiz.title].correct++;
            }
            else {
              if(studentAnswer.answer.correct) {
                numberOfCorrectAndIncorrectAnswers[studentAnswer.quiz.title].correct++;
              }
              else{
                numberOfCorrectAndIncorrectAnswers[studentAnswer.quiz.title].incorrect++;
              }
            }
          }
          console.log("here");
          console.log(numQuestionsInQuiz);
          for(var quiz in numQuestionsInQuiz){
            console.log(numQuestionsInQuiz[quiz].questions);
            numberOfCorrectAndIncorrectAnswers[quiz].unanswered = numQuestionsInQuiz[quiz].questions - (numberOfCorrectAndIncorrectAnswers[quiz].correct + numberOfCorrectAndIncorrectAnswers[quiz].incorrect);
            console.log(numberOfCorrectAndIncorrectAnswers[quiz].unanswered);
          }
          for(var quiz in numberOfCorrectAndIncorrectAnswers) { //For each key or student in the map
              console.log("Quiz: ");
              console.log(quiz);
              var entry = {"Name": quiz, "Questions Correct" : numberOfCorrectAndIncorrectAnswers[quiz].correct, "Questions Incorrect" : numberOfCorrectAndIncorrectAnswers[quiz].incorrect, "Questions Unanswered": numberOfCorrectAndIncorrectAnswers[quiz].unanswered}; //Make a pair corresponding to the value pair in the map
              arrayNumberOfCorrectAndIncorrectAnswers.push(entry); //Put it in the array
          }
          console.log(arrayNumberOfCorrectAndIncorrectAnswers);
          res.json(arrayNumberOfCorrectAndIncorrectAnswers);
        });
      });
    });
  },
  getParticipationForStudent: function(req, res){
    var data = req.params.all();
    var studentId = data.studentId;
    var courseId = data.courseId;
    var quizTaken = {};
    var numTaken = 0;
    var numMissed = 0;
    var numberOfTakenQuizzes = [];

    StudentAnswer.find({student:studentId})
    .populate('quiz')
    .then(function(studentAnswers) {
      for(var i = 0; i < studentAnswers.length; i++) {
        var studentAnswer = studentAnswers[i];
        if(quizTaken[studentAnswer.quiz.title] == undefined){
          quizTaken[studentAnswer.quiz.title] = true;
          numTaken++;
        }
      }
      Quiz.find({course: courseId})
        .then(function(quizzes){
          numMissed = quizzes.length - numTaken;
          numberOfTakenQuizzes.push({
            "type": "Quizzes Taken",
            "number": numTaken
          });
          numberOfTakenQuizzes.push({
            "type": "Quizzes Missed",
            "number": numMissed
          });
          res.json(numberOfTakenQuizzes);
      });
    });
  },

  sectionStudentAttendance: function(req, res){
    var data = req.params.all();
    var sectionId = data.sectionId;
    var courseId = data.courseId;
    var QuizAttendances = [];
    var courseOrSectionId = sectionId ? sectionId : courseId;
    var hasSection = sectionId ? "getStudentsBySectionId" : "getStudentsByCourseId";
    StudentService[hasSection](courseOrSectionId).then(function(students) {
      Quiz.find({course: courseId}).then(function(quizzes){
        return Promise.each(quizzes, function(quiz, i){
          QuizAttendances.push({
            "Name": quiz.title,
            "Student Attendance": 0
          });
        }).then(function(){
          return Promise.each(students, function(student, j){
            return StudentAnswer.find({student: student.id})
            .populate('quiz')
            .then(function(studentAnswers) {
              console.log(QuizAttendances.length);
              for(var i = 0; i < QuizAttendances.length; i++){
                for(var k = 0; k < studentAnswers.length; k++) {
                  var studentAnswer = studentAnswers[k];
                  if(studentAnswer.quiz.title == QuizAttendances[i]["Name"]){
                    console.log(QuizAttendances);
                    // console.log
                    console.log(QuizAttendances[i]);
                    QuizAttendances[i]["Student Attendance"]++;
                    break;
                  }
                }
              }
            });
          }).then(function(){
            console.log("returning value");
            console.log(QuizAttendances);
              return res.json(QuizAttendances);
            });
        });
      });
    });
  },

};
