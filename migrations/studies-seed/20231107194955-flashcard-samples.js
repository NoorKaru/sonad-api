'use strict';
const { lemmas } = require('../../fixtures/lemmas');

const flashcardSamples = require('../../fixtures/samples.json');

var dbm;
var type;
var seed;

function* chunks(arr, n) {
	for (let i = 0; i < arr.length; i += n) {
		yield arr.slice(i, i + n);
	}
}

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
	const chunkGenerator = chunks(flashcardSamples, 10);
	let index = 1;
	for (const chunk of chunkGenerator) {
		console.log('Started chunk ', index);
		const promises = chunk.map((sample) => {
			const { lemma, ...rest } = sample;

			return db.insert('flashcard_samples', ['lemma', 'data'], [lemma, JSON.stringify(rest)]);
		});
		await Promise.all(promises);
		console.log('Finished chunk ', index);
		index++;
	}
};

exports.down = async function (db) {
	await db.runSql('TRUNCATE TABLE flashcard_samples RESTART IDENTITY;');
};

exports._meta = {
	version: 1,
};
