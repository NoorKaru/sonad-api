import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import { Request } from 'express';

export default class ConsoleRequestLogger implements RequestLogger {
	async logRequest(req: Request): Promise<void> {
		// eslint-disable-next-line no-console
		console.log('Request incoming', req.originalUrl);
	}
}
