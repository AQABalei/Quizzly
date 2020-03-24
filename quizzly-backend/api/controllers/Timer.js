var Promise = require('bluebird');

module.exports = {
	returnTime: function(req, res){
		var time = new Date();
		console.log("GOT TO TIME RETURN: ", time);
		return time;
	}
};