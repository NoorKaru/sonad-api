import RateLimiterCache from '@lib/primary-adapters/http/ports/rate-limiter.interface';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import CacheRepository from '@lib/dictionary/application/ports/dictionary-cache.interface';
import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';

declare global {
	namespace Express {
		interface Request {
			rateLimiter: RateLimiterCache;
			logger: LoggerInterface;
			cache: CacheRepository;
			requestLogger: RequestLogger;
			requestTime: Date;
		}
	}
}

// why only this works: https://stackoverflow.com/a/58788706
