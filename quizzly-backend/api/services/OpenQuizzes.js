/**
 *  OpenQuizzes.js
 *
 *  @description  :: Caches quizzes asked by professors while quiz is valid.
 *  @methods      :: add(quiz), get(quizKey)
 */

var uuid = require('uuid');
var NodeCache = require( "node-cache" );
var quizzes = new NodeCache();
var bufferTime = 1;

module.exports = {
  add: function(quiz) {
    var key = uuid.v4();

    var totalDuration = quiz.questions.reduce(function(total, question){
      return total + question.duration;
    }, 0);

    quiz.timeAsked = Date.now();

    console.log('Adding Quiz to OpenQuizzes', quiz);

    var ttl = totalDuration + bufferTime; //ttl = time to live
    sails.log.debug('ttl', ttl);
    quizzes.set(key, JSON.stringify(quiz), ttl);
    return key;
  },
  get: function(quizKey){
    var data = quizzes.get(quizKey);
    if(!data) { return null; }
    var quiz = JSON.parse(data);

    var elapsedTime = (Date.now() - quiz.timeAsked) / 1000;

    var runningSum = 0;
    var checkFirstQuestion = true;
    var firstQuestionIndex = 0;
    var firstQuestionDuration = 0;

    var i = -1;
    quiz.questions = quiz.questions.filter(function(question){
      i++;
      runningSum += question.duration;
      if (runningSum < elapsedTime) {
        i--;
        return false;
      }

      if(checkFirstQuestion) {
        firstQuestionIndex = i;
        firstQuestionDuration = (runningSum - elapsedTime);
        checkFirstQuestion = false;
      }

      return true;
    });

    quiz.questions[firstQuestionIndex].duration = Math.floor(firstQuestionDuration);

    const totalTimeRemaining = quiz.questions.reduce((total, question) => total+question.duration, 0);

    return {
      quiz: quiz,
      timeRemaining: totalTimeRemaining
    };
  },
  superGet(quizKey) {
    var data = quizzes.get(quizKey);
    if(!data) { return null; }
    return JSON.parse(data);
  }
};
