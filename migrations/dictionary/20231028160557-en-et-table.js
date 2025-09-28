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
  CREATE TABLE IF NOT EXISTS en_et (
    id SERIAL PRIMARY KEY,
    word_en text,
    word_et text
  );`;

	await db.runSql(sql);
};

exports.down = async function (db) {
	await db.dropTable('en_et');
};

exports._meta = {
	version: 1,
};
