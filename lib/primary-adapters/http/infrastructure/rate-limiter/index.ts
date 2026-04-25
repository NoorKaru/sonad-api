import InMemoryRateLimiter from '@lib/primary-adapters/http/infrastructure/rate-limiter/inMemory/in-memory-rate-limiter';
import RedisRateLimiter from '@lib/primary-adapters/http/infrastructure/rate-limiter/redis/redis-rate-limiter';
import RateLimiterInterface from '@lib/primary-adapters/http/ports/rate-limiter.interface';
import Redis from 'ioredis';
import config from '@lib/global-config';

export default {
	getRateLimiter(): RateLimiterInterface {
		const rateLimiterUrl = config.server.rateLimit.url;
		if (rateLimiterUrl) {
			try {
				const redisClient = new Redis(rateLimiterUrl);
				return new RedisRateLimiter(redisClient);
			} catch (err) {
				return new InMemoryRateLimiter();
			}
		}

		return new InMemoryRateLimiter();
	},
};
