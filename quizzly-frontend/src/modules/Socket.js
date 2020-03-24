import Api from './Api';
import {browserHistory} from 'react-router';
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);


io.sails.url = Api.baseUrl;

module.exports = {
    subscribeToSections: function() {
        io.socket.on('question', function gotQuestion (data) {
            browserHistory.push('/s/answer/question/'+data.questionKey);
        });

        io.socket.on('quiz', function gotQuestion (data) {
            browserHistory.push('/s/answer/quiz/'+data.quizKey);
        });
        return io.socket.get('/section/connect');
    }
};