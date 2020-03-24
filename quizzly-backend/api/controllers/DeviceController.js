/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	pushTest: function(req, res) {
	  var data = req.params.all();
    var studentId = data.student;

    var testData = {
      title: 'Test Push Notification',
      data: {

      }
    };

    if(!!studentId) {
      return Device.pushToDevicesFromStudentIds([studentId], testData, function(result){

        sails.log.debug('result', result);
        var successResponses = result.sent.map(function(sent){
            return sent.response;
        });
        var failedResponses = result.failed.map(function(fail){
          return fail.response;
        });
        sails.log.debug('success', successResponses);
        sails.log.debug('failed', failedResponses);
        var failedErrors = failedResponses.map(fail => fail.error);
        sails.log.debug('errors', failedErrors);


        return res.ok();
      });
    }

    return res.status(400).send('No studentId');
  }
};
