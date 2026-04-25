import { Query } from '@lib/shared/bus/query.interface';

export class GetDictionaryEntryQuery implements Query {
	_type = 'query';
	#searchTerm: string;

	constructor(searchTerm: string) {
		this.#searchTerm = searchTerm;
	}

	get searchTerm(): string {
		return this.#searchTerm;
	}
}
