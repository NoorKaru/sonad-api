'use strict';
const translations = require('../../fixtures/en_et.json');
const crypto = require('crypto');

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = async function (db) {
	const insertPromises = translations.map((translation) => {
		return db.insert('en_et', ['word_en', 'word_et'], [translation.en, translation.et]);
	});

	await Promise.all(insertPromises);
};

exports.down = async function (db) {
	await db.runSql('DELETE FROM en_et;');
};

exports._meta = {
	version: 1,
};
