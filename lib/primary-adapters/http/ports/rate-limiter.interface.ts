export default interface RateLimiterCacheInterface {
	hasReachedRateLimit(key: string, limit: number): Promise<boolean>;
	incr(key: string): void;
}
