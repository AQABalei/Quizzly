/**
* Student.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
    // Primitives
    type: {
      type: 'string',
      defaultsTo: 'STUDENT'
    },
    email: {
      type: 'string',
      unique: true,
      required: true
    },
    isEmailValidated: {
      type: 'boolean',
      defaultsTo: false
    },
    password: {
      type: 'text',
      required: true
    },
    studentId: {
      type: 'string',
      defaultsTo: ''
    },
    firstName: {
      type: 'string',
      defaultsTo: ''
    },
    lastName: {
      type: 'string',
      defaultsTo: ''
    },
    school: {
      type: 'string',
      defaultsTo: ''
    },
    channelID: {
      type: 'string'
    },
    deviceType: {
      type: 'string'
    },

    // Associations
    sections: {
      collection: 'section',
      via: 'students',
      unique: true
    },

    // Methods
    getFullName: function() {
      return this.firstName + ' ' + this.lastName;
    }
  }
};
