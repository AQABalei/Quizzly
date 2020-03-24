/**
 * StudentAnswerController
 *
 * @description :: Server-side logic for managing Studentanswers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var Q = require('q');


module.exports = {

	getMetrics: function(req, res){
		var allQuestions = StudentAnswer.find({
      student: req.param('student'),
      quiz: req.param('quiz')
		})
		.populate('answer')
		.then(function(studentanswers){
			console.log(studentanswers);
			console.log("hey hi " + req.param('quiz'));
			var questions = Question.find({
	        "quiz": req.param('quiz')
	    })
			.populate('answers')
			.populate('quiz')
	    .then(function (questions){
				//creating map of studentanswers
				var studentanswersmap = {};
				for(var i = studentanswers.length-1; i >= 0; i--) {
					// Start from end, keep only the latest answer
					if (studentanswers[i].question in studentanswersmap) {
						studentanswers.splice(i, 1);
					} else {
						studentanswersmap[studentanswers[i].question] = studentanswers[i];
					}
				}
				console.log("Over here: ");
				console.log(studentanswersmap);
				console.log(questions);
				var countIncorrect = 0;
				for(var i = 0; i < questions.length; i++){
					var studentanswer = studentanswersmap[questions[i].id];
					if(studentanswer){
						if(questions[i].answers.length > 0){
							for(var j = 0; j < questions[i].answers.length; j++){
								//Assumes that students answer all multiple choice questions
								if((studentanswer.answer.id == questions[i].answers[j].id) && (studentanswer.answer.correct == false)){
									console.log("here");
									questions[i].answers[j].studentSelectedIncorrect = true;
									questions[i].incorrect = true;
									countIncorrect++;
									break;
								}
							}
						}
						else{
							if(studentanswers[i].text){
								questions[i].answerText = studentanswers[i].text;
							}
						}
					}
					else{
						questions[i].studentUnanswered = true;
					}
				}
				var object = {
					quiz: questions[0].quiz.title,
					questions: questions,
					size: questions.length,
					countIncorrect: countIncorrect,
					countCorrect: studentanswers.length - countIncorrect,
					countUnanswered: questions.length - studentanswers.length
				};
				console.log(questions);
	      return res.json(object);
	    });
		});
	},

	getStudentCountByAnswerId: function(req,res) {
    	console.log("--------------getStudentCountByAnswerId");
    	// var data = req.params.all();
        var id = req.param('id');
        var section = req.param('section');
    	console.log("id: ", id);
        console.log("section: ", section);
        if (section == -1) {
            StudentAnswer.count({answer: id}).exec(function(err, found){
            console.log("found: ", found);
            return res.json(found);

        });
        } else {
        // console.log("data.section", data.section);
    	StudentAnswer.count({answer: id, section: section}).exec(function(err, found){
    		console.log("found: ", found);
    		return res.json(found);

    	});
    }
	},


	// NEEDS TESTING -------------------------------------------------------------------------
	getMetricsForQuestion: function(req, res) {
    	console.log("--------------getMetricsForQuestion");
		let questionId = req.param('id')

		// Logic:
		// 1) get all answers for a question
		// 2) Map answer ID to count
		// 3) Map answer option to count
		// 4) return JSON { A: Number, B: number, ... }

		// 1. Get all answers for a quesiton
		StudentAnswer.find({question: questionId}).exec(function(err, answers) {
			if (err) {
				return res.json({
					error: "Cannot find question"
				})
			}

			console.log("Answers found for question:", answers)

			// 2. Map ID to count
			let answerMap = new Map()
			let answerKeys = []
			answers.forEach((e)=>{
				if (answerMap.has(e['answer'])) {
					answerMap.set(e['answer'], answerMap.get(e['answer']) + 1)
				} else {
					answerMap.set(e['answer'], 1)
					answerKeys.push(e['answer'])
				}
			})

			console.log("ANSWER MAP", answerMap)

			// 3. Map Option to count
			var promises = []
			let optionMap = new Map()
			async.each(answerKeys, function(value, callback){
				Answer.findOne({id: value}).exec(function(err, ans){
					optionMap.set(ans['option'], answerMap.get(value))
					callback(null)
				})
			}, function(e) {
				if (e) console.log("TEST")
				if (!e) {
					let response = []
					optionMap.forEach((v, k, m)=>{
						let hold = {}
						hold['option'] = k
						hold['count'] = v
						response.push(hold)
					})
					return res.json(response)
				}
			})
			console.log("END");

			/*answerMap.forEach(function(value, key, mp) {
				var promise = Answer.findOne({id: key}).exec(function(err, ans){
					console.log("Answer.findOne-->")
					console.log("ANS", ans)
					console.log("ACOUNT", answerMap.get(key))
					optionMap.set(ans['option'], answerMap.get(key))
				}
				)
				promises.push(promise)
			})
			Q.allSettled(promises).then(()=>{
				console.log("OPTION MAP", optionMap)
				console.log("OPTION MAP JSON", JSON.stringify(optionMap))
				return res.json(JSON.stringify(optionMap))
			})*/


		})
	},

	getTableDataOfStudentAnswersForSection: function(req, res) {

			console.log("--------------getTableDataOfStudentAnswersForSection");

			var quizID = req.param('quiz')
      var sectionID = req.param('section')

			Quiz.findOne({id: quizID}).populate('questions').exec(function(err, quiz) {

				if (err) {
					console.log("Quiz " + quizID + " not found")
					return res.status(401).send('Quiz Not Found!');
				}

				// set up the columns using the quiz question values
				var questionColumns = [];
				var answerDefaults = {};

				quiz.questions.forEach(function(question) {
					questionColumns.push({Header: question.text, accessor: question.id.toString()});
					answerDefaults[question.id.toString()] = '-Unanswered-';
				});

				// set the column values
				var columns = [{
	        Header: "Students",
	        columns: [
	            {
	              Header: 'First Name',
	              accessor: 'firstName',
	            }, {
	              Header: 'Last Name',
	              accessor: 'lastName',
	            }, {
	              Header: "Email",
	              accessor: 'email',
	            },
	          ]
	        }, {
	          Header: quiz.title,
	          columns: questionColumns
	        }
	      ];


				// find the corresponding section
				Section.findOne({id: sectionID}).populate('students').exec(function(err, section) {

					if (err) {
						console.log("Section " + sectionID + " not found")
						return res.status(401).send('Section Not Found!');
					}

					// store the data in the following structures
					// student summary makes sure async calls don't overwrite answerData
					var studentSummary = {};
					var answerData = []

					// go through all students
					section.students.forEach(function(student) {

						// set the default values
						studentSummary[student.email] = {}
						Object.assign(studentSummary[student.email], answerDefaults)

						// set personal info
						studentSummary[student.email]['firstName'] = student.firstName;
						studentSummary[student.email]['lastName'] = student.lastName;
						studentSummary[student.email]['email'] = student.email;

						// add all of students answers
						StudentAnswer.find({quiz: quizID, section: sectionID, student: student.id})
						.populate('question')
						.populate('answer').exec(function(err, studentAnswers) {

							console.log(studentAnswers);
							if (err) {
								// do nothing
							}
							else {
								async.each(studentAnswers, function(studentAnswer) {
									studentSummary[student.email][studentAnswer.question.id.toString()] = studentAnswer.answer.option;
								});

								answerData.push(studentSummary[student.email])
							}

							// if all have been iterated thoguh, return the result
							if(answerData.length === section.students.length){

								res.json({
									'columns': columns,
									'data': answerData
								})
							}
						});
					});
				})
			})
	}
};
