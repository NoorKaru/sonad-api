export type DictionaryResponseV2 = {
	[key: string]: unknown;
}[];

export default interface ExternalDictionaryV2 {
	getDictionaryEntry(searchTerm: string): Promise<DictionaryResponseV2>;
}
