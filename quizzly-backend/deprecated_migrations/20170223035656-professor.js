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
  db.createTable('professor', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      email: 'string',
      password: 'text',
      firstName: 'string',
      lastName: 'string',
      type: 'string',
      isEmailValidated: 'boolean',
      facultyId: 'string',
      school: 'string',
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'}  // shorthand notation
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('professor', callback);
};

exports._meta = {
  "version": 1
};
