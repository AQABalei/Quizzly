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

exports.up = function(db, callback) {
  db.createTable('term', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      season: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'term_season_fk',
          table: 'season',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      year: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'term_year_fk',
          table: 'year',
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
  db.dropTable('term', callback);
};

exports._meta = {
  "version": 1
};
