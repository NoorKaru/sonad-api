import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';

export default class NoDictionaryCache implements DictionaryCache {
	async get(_key: string): Promise<string | null> {
		return null;
	}

	async set(_key: string, _value: string) {
		return;
	}
}
