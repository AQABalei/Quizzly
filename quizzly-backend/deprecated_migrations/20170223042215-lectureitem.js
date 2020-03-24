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
  db.createTable('lectureitem', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      title: 'string',
      type: 'string',
      lecture: {
      	type: 'int',
      	notNull: true,
      	foreignKey: {
	        name: 'lectureitem_lecture_fk',
	        table: 'lecture',
	        rules: {
	          onDelete: 'RESTRICT',
	          onUpdate: 'RESTRICT'
	        },
	        mapping: 'id'
	      }
      },
      question: {
      	type: 'int',
      	notNull: true,
		    foreignKey: {
	        name: 'lectureitem_question_fk',
	        table: 'question',
	        rules: {
	          onDelete: 'RESTRICT',
	          onUpdate: 'RESTRICT'
	        },
	        mapping: 'id'
	    }
      },
	      
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'}  // shorthand notation
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('lectureitem', callback);
};

exports._meta = {
  "version": 1
};
