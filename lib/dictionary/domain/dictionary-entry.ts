export type partOfSpeechesTag =
	| 'nimisõna'
	| 'tegusõna'
	| 'sidesõna'
	| 'määrsõna'
	| 'eessõna'
	| 'tagasõna'
	| 'täiendsõna'
	| 'omadussõna'
	| 'asesõna'
	| 'arvsõna'
	| 'hüüdsõna';

export type Meaning = {
	definition: string;
	partofSpeech: string;
	synonyms: Array<string>;
	examples: Array<string>;
};

export type NounForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type AdjectiveForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type PronounForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type NumberWordForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type AdverbForm = {
	muutumatu: string;
};

export type ConjunctionForm = {
	muutumatu: string;
};

export type ExclamationForm = {
	muutumatu: string;
};

export type PrePostPositionForm = {
	muutumatu: string;
};

export type ComplementForm = {
	muutumatu: string;
};

export type UnknownForm = {
	[key: string]: any;
};

export type VerbForm = {
	'ma-form': string;
	'da-form': string;
	'3-person-present-singular': string;
	'3-person-past-singular': string;
	'nud-form': string;
	'tud-form': string;
	'impersonal-form-present': string;
	'imperative-2-person-singular': string;
};

export type WordForm =
	| NounForm
	| VerbForm
	| AdjectiveForm
	| AdverbForm
	| PronounForm
	| ConjunctionForm
	| ExclamationForm
	| PrePostPositionForm
	| ComplementForm
	| NumberWordForm
	| UnknownForm;

export interface IDictionaryEntry {
	word: string;
	wordId: string;
	wordForms: WordForm;
	partOfSpeech: partOfSpeechesTag[];
	meanings: Meaning[];
	getWord(): string;
	getPartOfSpeech(): partOfSpeechesTag[];
	getWordForms(): WordForm;
	getMeanings(): Meaning[];
}

export class DictionaryEntry implements IDictionaryEntry {
	word: string;
	wordId: string;
	partOfSpeech: partOfSpeechesTag[];
	meanings: Meaning[];
	wordForms: WordForm;

	constructor(
		word: string,
		wordId: string,
		partOfSpeech: Array<partOfSpeechesTag>,
		meanings: Array<Meaning>,
		wordForms: WordForm
	) {
		this.word = word;
		this.wordId = wordId;
		this.partOfSpeech = partOfSpeech;
		this.wordForms = wordForms;
		this.meanings = meanings;
	}
	getWord(): string {
		return this.word;
	}
	getWordId(): string {
		return this.wordId;
	}
	getPartOfSpeech(): partOfSpeechesTag[] {
		return this.partOfSpeech;
	}
	getWordForms(): WordForm {
		return this.wordForms;
	}
	getMeanings(): Meaning[] {
		return this.meanings;
	}
	toJSON() {
		return Object.assign({}, this);
	}

	static fromJSON(json: any) {
		const dictionaryEntry = Object.create(DictionaryEntry.prototype);

		return Object.assign(dictionaryEntry, json);
	}
}

export default IDictionaryEntry;
