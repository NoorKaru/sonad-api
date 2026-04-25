import ExternalDictionaryV2, {
	DictionaryResponseV2,
} from '@lib/dictionary/application/ports/external-dictionary-v2.interface';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import { EkilexClient } from '@vanakaru/ekilex-api-client';

import { Forms, Government, Lexeme, Paradigm } from '@vanakaru/ekilex-api-client/lib/src/resources/words';

type WordForm = {
	code: string;
	morphValue: string;
	value: string;
	inflectionType: string;
};

type translation = {
	[key in string]: {
		words: string;
		weight: number;
	}[];
};

export default class DictonaryEkilex implements ExternalDictionaryV2 {
	private logger: LoggerInterface;
	private ekilexClient: EkilexClient;

	constructor(logger: LoggerInterface, ekilexClient: EkilexClient) {
		this.logger = logger;
		this.ekilexClient = ekilexClient;
	}

	private extractWordFormsFromParadigm(paradigm: Paradigm): WordForm[] {
		return paradigm.forms.reduce((acc: WordForm[], item: Forms) => {
			const existingItem = acc.find((form: WordForm) => form.code === item.morphCode);
			if (existingItem) {
				existingItem.value += ',' + item.value;
			} else {
				acc.push({
					inflectionType: paradigm.inflectionType,
					code: item.morphCode,
					morphValue: item.morphValue,
					value: item.value,
				});
			}
			return acc;
		}, []);
	}

	private extractFromLexeme(lexeme: Lexeme) {
		const definitions = lexeme.meaning.definitions.map((definition) => definition.value).join(',');

		const usages = lexeme.usages.map((usage) => usage.value);

		const partOfSpeechTags = lexeme?.pos?.map((pos) => ({ code: pos.code, value: pos.value })) ?? [];

		const synonymLangGroup = lexeme.synonymLangGroups.find((synonymLangGroup) => synonymLangGroup.lang === 'est');

		const synonyms = synonymLangGroup
			? synonymLangGroup.synonyms.map((synonym) => synonym.words.map((word) => word.wordValue).join(','))
			: [];

		const rection = lexeme?.governments.map((gov: Government) => gov.value).join(',') ?? '';

		const translations = lexeme.synonymLangGroups.reduce((acc: translation, synonymLangGroup) => {
			if (synonymLangGroup.lang === 'est') {
				return acc;
			}

			synonymLangGroup.synonyms.forEach((synonym) => {
				if (!acc[synonym.wordLang]) {
					acc[synonym.wordLang] = [];
				}
				acc[synonym.wordLang].push({
					words: synonym.words.map((word) => word.wordValue).join(','),
					weight: synonym.weight,
				});
			});

			return acc;
		}, {});

		return {
			definition: definitions,
			partOfSpeech: partOfSpeechTags,
			rection,
			examples: usages,
			synonyms,
			translations,
		};
	}

	private async getWordIds(searchTerm: string): Promise<number[]> {
		const searchResult = await this.ekilexClient.words.search(searchTerm, ['eki']);
		return searchResult.words.map((word) => word.wordId);
	}

	async getDictionaryEntry(searchTerm: string): Promise<DictionaryResponseV2> {
		try {
			const wordIds = await this.getWordIds(searchTerm);

			const promises = wordIds.map((wordId) => this.ekilexClient.words.getDetails(wordId, ['eki']));

			const wordDetails = await Promise.all(promises);

			const wordDetaildWithParadigms = wordDetails.filter((wordDetail) => wordDetail?.word?.paradigms);

			const result = wordDetaildWithParadigms.map((wordDetail) => {
				const wordClasses = [...new Set(wordDetail?.word?.paradigms.map((paradigm) => paradigm.wordClass))];

				const wordForms = wordDetail.word.paradigms.map(this.extractWordFormsFromParadigm).flat();

				const rest = wordDetail.lexemes
					.filter((lexeme) => lexeme.datasetCode === 'eki')
					.map(this.extractFromLexeme);

				const similarWords =
					wordDetail?.wordRelationDetails?.primaryWordRelationGroups
						.find((group) => group?.groupTypeLabel.toLowerCase() === 'veel sarnaseid sõnu')
						?.members?.map((member) => member.wordValue) ?? [];

				return {
					wordClasses,
					wordForms,
					meanings: rest,
					similarWords,
				};
			});

			return result;
		} catch (err) {
			this.logger.error({
				message: 'Unable to query ekilex',
				context: 'TRANSLATE',
			});
			throw err;
		}
	}
}
