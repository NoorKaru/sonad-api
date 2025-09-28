import Logger from '@lib/dictionary/application/ports/logger.interface';
import ConsoleRequestLogger from './console/console-request-logger';
import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import PostgresRequestLogger from './postgres/postgres-request-logger';
import config from '@lib/global-config';
// import SqliteRequestLogger from './sqlite/sqlite-request-logger';
// import path from 'path';

export default {
	async getRequestLogger(logger: Logger): Promise<RequestLogger> {
		const requestLoggerUrl = config.db.requestLogger.url;

		if (requestLoggerUrl.startsWith('postgres://')) {
			return new PostgresRequestLogger(logger, requestLoggerUrl);
		}

		// if (requestLoggerUrl === 'sqlite') {
		// 	const relativeDbPath = '../../../../assets/sonapi.db';
		// 	const absoluteDbPath = path.join(__dirname, relativeDbPath);
		// 	return new SqliteRequestLogger(logger, absoluteDbPath);
		// }

		return new ConsoleRequestLogger();
	},
};
