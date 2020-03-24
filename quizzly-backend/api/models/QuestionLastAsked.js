/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    // Primitives
    id: {
      type: 'integer',
      required: true
    },
    section: {
      type: 'integer',
      required: true
    },
    lastAsked: {
      type: 'datetime'
    }
  }
};

