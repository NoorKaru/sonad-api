'use strict';
const studentsData = require('../../fixtures/students.json');
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
	const insertPromises = studentsData.map((student) => {
		const data = {
			...student,
			studySets: student.studySets.map((studySet) => ({
				...studySet,
				id: crypto.randomUUID(),
			})),
		};

		return db.insert('students', ['data'], [JSON.stringify(data)]);
	});

	await Promise.all(insertPromises);
};

exports.down = async function (db) {
	await db.runSql('DELETE FROM students;');
};

exports._meta = {
	version: 1,
};
