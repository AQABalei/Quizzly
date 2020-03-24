/**
 * Lecture.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: { // 'CSCI 201'
      type: 'string',
      required: true
    },
    lectureItems: {
      collection: 'lectureItem',
      via: 'lecture'
    },
    professor: {
      model: 'professor'
    },
    course: {
      model: 'course'
    },
  }
};
