'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = async function (db) {
	await db.runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
};

exports.down = async function (db) {
	db.runSql('DROP EXTENSION IF EXISTS "uuid-ossp";');
};

exports._meta = {
	version: 1,
};
