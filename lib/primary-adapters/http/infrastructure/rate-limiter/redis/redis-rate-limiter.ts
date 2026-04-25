import RateLimiterCache from '@lib/primary-adapters/http/ports/rate-limiter.interface';
import Redis from 'ioredis';

export default class RedisRateLimiter implements RateLimiterCache {
	private redisClient;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
	}
	async hasReachedRateLimit(key: string, limit: 60): Promise<boolean> {
		const amountOfRequests = await this.redisClient.get(key);

		return Boolean(Number(amountOfRequests) >= Number(limit));
	}

	incr(key: string) {
		this.redisClient.multi().incr(key).expire(key, 10).exec();
	}
}
