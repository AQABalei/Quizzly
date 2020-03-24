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
	db.insert('season', ['season'], ['Fall'], null);
	db.insert('season', ['season'], ['Summer'], null);
	db.insert('season', ['season'], ['Winter'], null);
	db.insert('season', ['season'], ['Summer'], null);
	db.insert('year', ['year'], ['2016'], null);
    db.insert('year', ['year'], ['2017'], callback);
};

exports.down = function(db, callback) {
	callback();
};

exports._meta = {
  "version": 1
};
