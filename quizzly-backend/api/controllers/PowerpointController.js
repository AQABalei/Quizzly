function colorCorrection(option){
	if(option == 'A'){
		return 'chco=66f08d,FF3000,FF3000&';
	}else if(option == 'B'){
		return 'chco=FF3000,66f08d,FF3000&';
	}else if(option == 'C'){
		return 'chco=FF3000,FF3000,66f08d&';
	}
}



module.exports = {
  returnGraph: function(req, res) {
    var data = req.params.all();
   	sails.log("Got to return Graph");
   	console.log("Got to return Graph");
	console.log(data);

	var allQuestions = StudentAnswer.find({
      section: req.param('section'),
      question: req.param('question')
		})
		.populate('answer')
		.then(function(studentanswers){
			console.log(studentanswers);
			//return res.send(200, studentanswers);
			var questions = Question.find({
	        "quiz": req.param('quiz')
	    })
			.populate('answers')
			.populate('quiz')
	    .then(function (questions){
				//creating map of studentanswers
				var studentanswersmap = {};
				var keys = [];
				for(var i = studentanswers.length-1; i >= 0; i--) {
					// Start from end, keep only the latest answer
					if (studentanswers[i].student in studentanswersmap) {
							//studentanswers.splice(i, 1);
					} else {
						studentanswersmap[studentanswers[i].student] = studentanswers[i];
						keys.push(studentanswers[i].student);
					}
				}
				console.log("KEY LENGTH: " + keys.length);
				// console.log("Over here: ");
				//console.log(studentanswersmap);
				// console.log(questions);
				var countA = 0;
				var countB = 0;
				var countC = 0;
				var countCorrect = 0;
				var unAnswered = 0;
				var correct = '';
				for(var i = 0; i < keys.length; i++){
					var studentanswer = studentanswersmap[keys[i]];
					if(studentanswer){
						if(studentanswer['answer']['correct']){
							correct = studentanswer['answer']['option'];
							countCorrect++;
						}
					
						if(studentanswer['answer']['option'] == 'A'){
							countA++;
						}else if(studentanswer['answer']['option'] == 'B'){
							countB++;
						}else if(studentanswer['answer']['option'] == 'C'){
							countC++;
						}
						
					}
					else{
						//questions[i].studentUnanswered = true;
						unAnswered++;
					}
				}
				var object = {
					//quiz: questions[0].quiz.title,
					//questions: questions,
					size: keys.length,
					countIncorrect: keys.length - countCorrect,
					countCorrect: countCorrect,
					countUnanswered: unAnswered
				};
				console.log(questions);
				var percentA = (countA / keys.length) * 100;
				var percentB = (countB / keys.length) * 100;
				var percentC = (countC / keys.length) * 100;
				var url = 'http://chart.googleapis.com/chart?cht=bvg&chs=650x460&chxt=x,y,y&';
				url += 'chxl=0:|A|B|C|2:|Num+of+Students&chxp=2,50|0,18,50,82&'
				url += 'chxs=1,000000,10,0|0,000000,15,0|2,0a5eb2,12&chbh=a&'
				url += colorCorrection(correct);
				url += '&chxr=1,0,' + keys.length + '&';
				url += 'chd=t:'+percentA+'|'+percentB+'|'+ percentC;

	      return res.send(200, url);
	    });
		});



   	//return res.send(200, data); //"http://chart.googleapis.com/chart?cht=bvg&chs=650x460&chd=t:13|50|26&chxt=x,y,y&chxr=1,0,60&chxl=0:|A|B|C|2:|Num+of+Students&chxp=2,50|0,18,50,82&chxs=1,000000,10,0|0,000000,15,0|2,0a5eb2,12&chbh=a&chco=FF3000,66f08d,FF3000");
  }
};
