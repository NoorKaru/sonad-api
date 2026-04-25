import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';

export default class NoDictionaryCache implements DictionaryCache {
	async get(key: string): Promise<string | null> {
		return null;
	}

	async set(key: string, value: string) {
		return;
	}
}
