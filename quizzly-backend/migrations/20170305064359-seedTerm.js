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
	db.runSql('INSERT INTO term (year, season) SELECT y.id, s.id FROM year y, season s ORDER BY y.year ASC', null, callback);
};

exports.down = function(db, callback) {
  	callback();
};

exports._meta = {
  "version": 1
};
