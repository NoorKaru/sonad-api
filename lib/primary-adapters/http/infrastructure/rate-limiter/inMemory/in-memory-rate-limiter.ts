import RateLimiterCache from '@lib/primary-adapters/http/ports/rate-limiter.interface';

interface inMemoryCounter {
	[key: string]: number;
}

export default class InMemoryRateLimiter implements RateLimiterCache {
	private inMemoryCounter: inMemoryCounter;

	constructor(inMemoryCounter: inMemoryCounter = {}) {
		this.inMemoryCounter = inMemoryCounter;
	}
	async hasReachedRateLimit(key: string, limit: 100): Promise<boolean> {
		return Boolean(this.inMemoryCounter[key] >= limit);
	}

	incr(key: string) {
		if (!this.inMemoryCounter[key]) {
			this.inMemoryCounter[key] = 1;
			return;
		}
		this.inMemoryCounter[key]++;
	}
}
