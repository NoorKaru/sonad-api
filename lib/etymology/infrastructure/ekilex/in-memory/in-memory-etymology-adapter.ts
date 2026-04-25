import EtymologyPort from '@lib/etymology/application/ports/etymology.port';
import { EtymologyEntry } from '@lib/etymology/domain/etymology-entry';

export default class InMemoryEtymologyAdapter implements EtymologyPort {
	async getEtymology(word: string): Promise<EtymologyEntry[]> {
		return [
			{
				headword: word,
				inflectionForms: [],
				definitions: [`(in-memory stub) etymology for "${word}"`],
				cognates: [],
				etymNote: '',
				seeAlso: [],
			},
		];
	}
}
