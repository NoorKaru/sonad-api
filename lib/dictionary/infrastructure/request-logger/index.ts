import Logger from '@lib/dictionary/application/ports/logger.interface';
import ConsoleRequestLogger from './console/console-request-logger.js';
import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import PostgresRequestLogger from './postgres/postgres-request-logger.js';
import config from '@lib/global-config';

export default {
	async getRequestLogger(logger: Logger): Promise<RequestLogger> {
		const requestLoggerUrl = config.db.requestLogger.url;

		if (requestLoggerUrl.startsWith('postgres://')) {
			return new PostgresRequestLogger(logger, requestLoggerUrl);
		}

		return new ConsoleRequestLogger();
	},
};
