/**
* Professor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    // Primitives
    type: {
      type: 'string',
      defaultsTo: 'PROFESSOR_PENDING' // PROFESSOR
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
    facultyId: {
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

    // Associations
    courses: {
      collection: 'course',
      via: 'professor'
    },

    // Methods
    getFullName: function() {
      return this.firstName + ' ' + this.lastName;
    }
  }
};
