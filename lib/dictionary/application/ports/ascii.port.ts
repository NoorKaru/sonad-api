export type SearchResult = {
	wordClasses: string[];
	wordForms: {
		code: string;
		value: string;
	}[];
	meanings: {
		definition: string;
		examples: string[];
		synonyms: string[];
	}[];
	similarWords: string[];
};

export type DictionaryResponse = {
	searchResult: SearchResult[];
	translations: {
		from: string;
		to: string;
		input: string;
		translations: string[];
	}[];
	requestedWord: string;
	estonianWord: string;
};

export interface AsciiPort {
	getAsciiResponse(response: DictionaryResponse): string;
}
