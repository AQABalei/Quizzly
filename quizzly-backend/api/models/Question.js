/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    // Primitives
    text: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      enum: ['multipleChoice', 'freeResponse'],
      required: true
    },

    duration: {
      type: 'integer',
      defaultsTo: 30
    },
    lastAsked: {
      type: 'datetime'
    },
    isAttendanceQuestion: {
      type: 'boolean',
      defaultsTo: false
    },

    // Associations
    quiz: {
      model: 'quiz'
    },
    answers: {
      collection: 'answer',
      via: 'question'
    }

    // Methods
  }
};
