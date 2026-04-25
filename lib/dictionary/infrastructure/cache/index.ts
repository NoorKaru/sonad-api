import RedisCacheRepository from '@lib/dictionary/infrastructure/cache/redis-cache/redis-cache-repository';
import NoCacheRepository from '@lib/dictionary/infrastructure/cache/no-cache/no-cache-repository';
import Redis from 'ioredis';
import config from '@lib/global-config';
import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';

export default {
	getDictionaryCache(): DictionaryCache {
		if (config.cache.url) {
			try {
				const redisClient = new Redis(config.cache.url);
				return new RedisCacheRepository(redisClient);
			} catch (err) {
				return new NoCacheRepository();
			}
		}

		return new NoCacheRepository();
	},
};
