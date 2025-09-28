import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import { Request } from 'express';
import { Database, OPEN_READWRITE } from 'sqlite3';

export default class SqliteRequestLogger implements RequestLogger {
	private logger: LoggerInterface;
	private db: Database;

	constructor(logger: LoggerInterface, filepath: string) {
		this.logger = logger;

		this.db = new Database(filepath, OPEN_READWRITE, (err) => {
			if (err) {
				this.logger.error({
					message: err?.message ?? 'Unable to connect to sqlite database',
					context: 'DB_CONNECT',
				});

				throw err;
			}
			this.logger.info({
				message: 'Connected to the sql lite database.',
				context: 'DB_CONNECT',
			});
		});
	}

	async logRequest(req: Request): Promise<void> {
		try {
			const { ip, hostname, method, originalUrl, baseUrl, url } = req;

			const dbQuery =
				'INSERT INTO requests(ip, hostname, method, originalUrl, baseUrl, url, request_date) VALUES($1, $2, $3, $4, $5, $6, $7)';

			const now = new Date().toISOString();
			const values = [ip, hostname, method, originalUrl, baseUrl, url, now];
			this.db.run(dbQuery, values);
		} catch (error) {
			this.logger.error({
				message: 'Unable to store request',
				context: 'logRequest',
				error: JSON.stringify(error),
			});
		}
	}
}
