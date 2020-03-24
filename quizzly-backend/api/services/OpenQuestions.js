/**
 *  OpenQuestions.js
 *
 *  @description  :: Caches questions asked by professors while question is valid to be answered.
 *  @methods      :: add(question), get(questionKey)
 */

var uuid = require('uuid');
var NodeCache = require( "node-cache" );
var questions = new NodeCache();
var bufferTime = 1;

module.exports = {
  add: function(question) {
    // Generate a random unique identifier as the key to view the asked question
    // var key = uuid.v4();

    // Scratch that, just use its id as the key so students can open the asked question manually
    // May revert for future security features (e.g. push to bluetooth groups)
    var key = question.id;
    var ttl = question.duration + bufferTime; //ttl = time to live
    questions.set(key, JSON.stringify(question), ttl);
    return key;
  },
  get: function(questionKey){
    var data = questions.get(questionKey);
    var ttl = questions.getTtl(questionKey);
    if(!data || !ttl) { return null; }
    var question = JSON.parse(data);
    var expireDate = new Date(ttl);
    var timeRemaing = (expireDate - Date.now()) / 1000; // get seconds remaining until question expires.
    return {
      question: question,
      timeRemaining: timeRemaing,
      expireDate: expireDate
    };
  }
};
