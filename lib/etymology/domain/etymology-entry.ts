export type EtyCognate = {
	language: string;
	words: string[];
	meanings: string[];
	questionable: boolean;
};

export type EtymologyEntry = {
	headword: string;
	inflectionForms: string[];
	definitions: string[];
	cognates: EtyCognate[];
	etymNote: string;
	seeAlso: string[];
};
