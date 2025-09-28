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
	const sql = `
  CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data JSON NOT NULL
  );`;

	await db.runSql(sql);
};

exports.down = async function (db) {
	await db.dropTable('students');
};

exports._meta = {
	version: 1,
};
