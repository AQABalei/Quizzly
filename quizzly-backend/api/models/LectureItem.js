/**
 * LectureItem.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type: { // 'CSCI 201'
      type: 'string',
      enum: ['QUESTION', 'QUIZ'],
      required: true
    },
    lecture: {
      model: 'lecture',
    },
    quiz: {
      model: 'quiz',
    },
    question: {
      model: 'question',
    },
  }
};
