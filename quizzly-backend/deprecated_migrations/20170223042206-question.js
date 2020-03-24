'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('question', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      text: 'string',
      type: 'string',
      duration: 'int',
      quiz: {
      	type: 'int',
      	notNull: true,
	      foreignKey: {
	        name: 'question_quiz_fk',
	        table: 'quiz',
	        rules: {
	          onDelete: 'RESTRICT',
	          onUpdate: 'RESTRICT'
	        },
	        mapping: 'id'
	    }
      },
      lastAsked: {type: 'date'},     
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'}  // shorthand notation
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('question', callback);
};

exports._meta = {
  "version": 1
};
