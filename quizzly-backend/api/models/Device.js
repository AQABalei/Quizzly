/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    deviceId: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      enum: ['ios', 'android'],
      required: true
    },

    // associations
    student: {
      model: 'student'
    }
  },

  handleStudentLogin: function(student, mobileData) {
    var student = student.id;
    var type = mobileData.type;
    var deviceId = mobileData.deviceId;

    console.log('handleStudentLogin student', student);
    console.log('handleStudentLogin mobileData', mobileData);

    if(!student || !type || !deviceId) { return };

    Device.findOrCreate({
      deviceId: deviceId,
      type: type,
      student: student,
    }).exec(function(err, record) {
      if(err) { return sails.log.error(err); }
      record.student = student;
      record.save();
      sails.log.debug('Student: \'' + student + '\' is now registered with device: \'' + record.deviceId + '\'');
    });
  },

  pushToDevicesFromStudentIds: function(studentIds, data, callback) {
    Device.find().where({student:studentIds}).exec(function(err, records){
      if(err) {
        return sails.log.debug('Error occurend in pushToDevicesFromStudentIds');
      }
      else if(!records) {
        return sails.log.debug('Push requested but no devices found');
      }

      var deviceIds = records.map(function(device){ return device.deviceId; });

      Push.send(deviceIds, data, callback);
    });
  }


};

