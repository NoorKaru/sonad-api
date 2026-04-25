import { QueryHandler, QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';
import { GetDictionaryEntryQuery } from './get-dictionary-entry-query';
import ExternalDictionaryV2 from '../ports/external-dictionary-v2.interface';
import Logger from '@lib/dictionary/application/ports/logger.interface';
import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';

export type WordResponse = {
	[key in string]: any;
}[];

export class GetDictionaryQueryHandler implements QueryHandler<GetDictionaryEntryQuery> {
	#externalDictionary: ExternalDictionaryV2;
	#logger: Logger;
	#dictionaryCache: DictionaryCache;

	constructor(externalDictionary: ExternalDictionaryV2, dictionaryCache: DictionaryCache, logger: Logger) {
		this.#externalDictionary = externalDictionary;
		this.#dictionaryCache = dictionaryCache;
		this.#logger = logger;
	}
	async execute(query: GetDictionaryEntryQuery): Promise<QueryHandlerResponse> {
		const result = await this.getDictionaryEntry(query.searchTerm);

		if (!result) {
			return {
				success: false,
				payload: null,
			};
		}

		return {
			success: true,
			payload: result,
		};
	}

	private async getDictionaryEntry(searchTerm: string): Promise<WordResponse> {
		const cacheKey = `${searchTerm}_v2`;
		const cachedDictionaryEntry = await this.#dictionaryCache.get(cacheKey);

		if (cachedDictionaryEntry) {
			this.#logger.info({
				message: `Cache hit with term:${searchTerm}`,
				searchTerm,
				context: 'DICTIONARY',
			});
			try {
				const dictionaryEntry = JSON.parse(cachedDictionaryEntry);
				return dictionaryEntry;
			} catch (error) {
				this.#logger.error({
					message: `Unable to parse cache entry`,
					context: 'DICTIONARY',
				});

				const result = await this.#externalDictionary.getDictionaryEntry(searchTerm);

				if (result.length) {
					this.#dictionaryCache.set(cacheKey, JSON.stringify(result));
				}

				return result;
			}
		}

		const result = await this.#externalDictionary.getDictionaryEntry(searchTerm);

		if (result.length) {
			this.#dictionaryCache.set(cacheKey, JSON.stringify(result));
		}

		return result;
	}
}
