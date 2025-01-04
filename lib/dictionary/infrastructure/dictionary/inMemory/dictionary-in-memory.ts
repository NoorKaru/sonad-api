import ExternalDictionary from '@lib/dictionary/application/ports/external-dictionary.interface';
import { DictionaryResponse } from '@lib/dictionary/application/ports/external-dictionary.interface';
import { DictionaryEntry, Meaning, partOfSpeechesTag } from '@lib/dictionary/domain/dictionary-entry';
import { right } from '@lib/shared/common/either';

export default class DictionaryInMemory implements ExternalDictionary {
	async getWord(word: string): Promise<DictionaryResponse> {
		const wordId = '247445';
		const partOfSpeechesTags: Array<partOfSpeechesTag> = ['omadussõna'];
		const wordForms = {
			singular: {
				nimetav: 'tubli',
				omastav: 'tubli',
				osastav: 'tublit',
			},
			plural: {
				nimetav: 'tublid',
				omastav: 'tublide',
				osastav: 'tublisid',
			},
		};
		const meanings: Array<Meaning> = [
			{
				definition:
					'(inimese vm elusolendi kohta:) millegagi hästi hakkama saav, ootustele vastav, omadustelt millekski hea ja sobiv',
				partofSpeech: '',
				synonyms: [
					'usin',
					'nupukas',
					'nutikas',
					'taibukas',
					'taiplik',
					'kohusetruu',
					'kohusetundlik',
					'illikuku',
				],
				examples: [
					'Nende lastest on tublid inimesed kasvanud.',
					'Mari on meie kõige tublim töötaja.',
					'Sündis terve ja tubli tüdruk.',
				],
			},
		];

		const dictionaryEntry = new DictionaryEntry(word, wordId, partOfSpeechesTags, meanings, wordForms);
		return right(dictionaryEntry);
	}
}
