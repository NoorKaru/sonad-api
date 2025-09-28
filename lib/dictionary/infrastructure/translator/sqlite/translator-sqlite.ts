import Translator from '@lib/dictionary/application/ports/translator.interface';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';

import { Database, OPEN_READONLY } from 'sqlite3';

export default class TranslatorSqlite implements Translator {
	private logger: LoggerInterface;
	private db: Database;

	constructor(logger: LoggerInterface, filepath: string) {
		this.logger = logger;

		this.db = new Database(filepath, OPEN_READONLY, (err) => {
			if (err) {
				this.logger.error({
					message: err?.message ?? 'Unable to connect to sqlite database',
					context: 'DB_CONNECTr',
				});

				throw err;
			}
			this.logger.info({
				message: 'Connected to the sql lite database.',
				context: 'DB_CONNECT',
			});
		});
	}

	private removeSpecialCharacters(str: string): string {
		return str.replace(/[(){}[\]]/g, '');
	}

	async translate(word: string): Promise<string | null> {
		const query = `SELECT * FROM 'en_et' WHERE word_en = ?`;

		try {
			const estonianWord = await this.readDbPromise(query, [word], 'word_et');

			return (
				this.removeSpecialCharacters(estonianWord)
					?.trim()
					?.split(' ')?.[0]
					.split(',')?.[0]
					?.split(';')?.[0]
					?.trim() ?? null
			);
		} catch (err) {
			this.logger.error({
				message: 'Unable to query sqlite database',
				context: 'TRANSLATE',
			});
			return null;
		}
	}

	private getDbQuery(from: string, to: string): string | null {
		if (from === 'et' && to === 'en') {
			return 'SELECT word_en FROM et_en WHERE word_et LIKE $1';
		}

		if (from === 'en' && to === 'et') {
			return 'SELECT word_et FROM en_et WHERE word_en LIKE $1';
		}

		return null;
	}

	private getColumnName(from: string, to: string): string {
		if (from === 'et' && to === 'en') {
			return 'word_en';
		}

		return 'word_et';
	}

	async getTranslations(term: string, from: string, to: string): Promise<string[]> {
		try {
			const dbQuery = this.getDbQuery(from, to);

			if (!dbQuery) {
				throw new Error('direction mismatch');
			}

			const columnName = this.getColumnName(from, to);

			const translations = await this.readDbPromise(dbQuery, [term], columnName);

			if (!translations) {
				return [];
			}

			return translations
				.split(';')
				.reduce((acc: string[], curr: string) => {
					const splittedByComma = curr.split(',');

					return [...acc, ...splittedByComma];
				}, [])
				.map((word: string) => word.trim());

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			this.logger.error({
				message: `Unable to query postgress database: ${String(error?.message)}`,
				context: 'getTranslations',
			});
			return [];
		}
	}

	private async readDbPromise(query: string, params: string[], columnName: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.db.all(query, params, async (err, rows: { [x in string]: string }[]) => {
				if (err) {
					return reject(err);
				}

				const estonianWord = rows[0]?.[columnName];

				if (!estonianWord) {
					return resolve('');
				}

				return resolve(estonianWord);
			});
		});
	}
}
