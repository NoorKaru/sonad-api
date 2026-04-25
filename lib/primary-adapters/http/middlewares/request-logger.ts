import { Request, Response, NextFunction } from 'express';

const isSkippedUrl = (originalUrl: string): boolean => {
	const skippedUrls = String(process?.env?.SKIPPED_URLS).split(',');

	if (skippedUrls.includes(originalUrl)) {
		return true;
	}

	return false;
};

const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
	const logger = await req.requestLogger;
	try {
		if (!isSkippedUrl(req.originalUrl)) {
			await logger.logRequest(req);
		}
	} catch (err) {
		req.logger.error({
			message: 'unable to log request',
			context: 'REQUEST_LOGGER',
			error: JSON.stringify(err),
		});
	}

	next();
};

export default requestLogger;
