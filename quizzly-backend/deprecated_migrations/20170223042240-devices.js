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
  db.createTable('device', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      deviceID: 'string',
      type: 'string',
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'},  // shorthand notation
      student: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'device_student_fk',
          table: 'student',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      }
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('device', callback);
};

exports._meta = {
  "version": 1
};
