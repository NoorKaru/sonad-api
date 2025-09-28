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
  CREATE TABLE flashcard_samples (
    id SERIAL PRIMARY KEY,
    lemma TEXT NOT NULL,
    data JSON NULL DEFAULT NULL
  );`;

	await db.runSql(sql);
};

exports.down = async function (db) {
	await db.dropTable('flashcard_samples');
};

exports._meta = {
	version: 1,
};
