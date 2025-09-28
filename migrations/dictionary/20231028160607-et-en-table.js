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
  CREATE TABLE IF NOT EXISTS et_en (
    id SERIAL PRIMARY KEY,
    word_et text,
    word_en text
  );`;

	await db.runSql(sql);
};

exports.down = async function (db) {
	await db.dropTable('et_en');
};

exports._meta = {
	version: 1,
};
