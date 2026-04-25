import { Request, Response, NextFunction } from 'express';
import requestIp from 'request-ip';
import config from '@lib/global-config';

import { CustomError } from '@lib/primary-adapters/http/middlewares/error-handler';

const isWhiteListed = (origin: string): boolean => {
	const whiteListedDomains = String(process?.env?.WHITELIST).split(',');

	if (whiteListedDomains.includes(origin)) {
		return true;
	}

	return false;
};

const getRateLimit = (originalUrl: string): number | string => {
	if (originalUrl.includes('v1/')) {
		return config.server.rateLimit.v1;
	}

	return config.server.rateLimit.v2;
};

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
	const clientIP = String(requestIp.getClientIp(req));
	const minute = new Date().getMinutes();

	const key = `${clientIP}:${minute}`;
	const origin = req.get('origin') ?? '';

	const { originalUrl } = req;

	req.logger.debug({
		message: `Request of ${clientIP} : ${origin}`,
		context: 'RATE_LIMITER',
		clientIp: clientIP,
		origin,
	});

	if (isWhiteListed(origin)) {
		req.logger.info({
			message: `${origin} is whitelisted`,
			context: 'RATE_LIMITER',
			origin,
		});
		return next();
	}

	const rateLimit = Number(getRateLimit(originalUrl));

	const hasReachedRateLimit = await req.rateLimiter.hasReachedRateLimit(key, rateLimit);

	if (hasReachedRateLimit) {
		req.logger.warning({
			message: `${clientIP} has reached limit`,
			context: 'RATE_LIMITER',
			clientIp: clientIP,
			origin,
		});
		return next(
			new CustomError(
				'Too many requests, please switch to api version v2. version v1 is heavily rate limited and will soon be shut down',
				429
			)
		);
	}

	req.rateLimiter.incr(key);

	next();
};

export default rateLimiter;
