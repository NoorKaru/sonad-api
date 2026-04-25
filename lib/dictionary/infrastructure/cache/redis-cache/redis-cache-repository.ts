import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';
import Redis from 'ioredis';

export default class RedisDictionaryCache implements DictionaryCache {
	private redisClient;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
	}
	async get(key: string): Promise<string | null> {
		return await this.redisClient.get(key);
	}

	async set(key: string, value: string, ttlInSeconds: number) {
		if (ttlInSeconds) {
			return await this.redisClient.set(key, value, 'EX', ttlInSeconds);
		}

		return await this.redisClient.set(key, value);
	}
}
