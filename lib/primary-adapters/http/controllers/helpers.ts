import { WordResponse } from '@lib/dictionary/application/dictionary-v2-service';

const testJson = {
	test: 'test',
};

type SearchResult = {
	searchResult: {
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
	}[];
	translations: {
		from: string;
		to: string;
		input: string;
		translations: string[];
	}[];
	requestedWord: string;
	estonianWord: string;
};

function collectExamples(meanings: { definition: string; examples: string[]; synonyms: string[] }[]) {
	const examples = [];
	let examplesAdded = 0; // Keep track of how many examples have been added
	let pass = 0; // Which pass or cycle we're on (0-indexed)

	while (examples.length < 3) {
		let examplesCollected = false; // Flag to check if examples were collected in this pass

		for (const meaning of meanings) {
			if (meaning.examples[pass]) {
				// Check if there's an example for the current pass
				examples.push(meaning.examples[pass]);
				examplesAdded++;
				examplesCollected = true;

				if (examplesAdded >= 3) {
					// Break out if we've added enough examples
					break;
				}
			}
		}

		if (!examplesCollected) {
			// No more examples to collect
			break;
		}

		pass++;
	}

	return examples;
}

export const getAsciiResponse = (searchResult: SearchResult | void) => {
	// get first searchresult

	const result = searchResult?.searchResult[0];

	/**
	 * WORD FORMS START
	 */
	const SgN = result?.wordForms?.find((wordForm) => wordForm.code === 'SgN')?.value ?? '';
	const PlN = result?.wordForms?.find((wordForm) => wordForm.code === 'PlN')?.value ?? '';

	const SgG = result?.wordForms?.find((wordForm) => wordForm.code === 'SgG')?.value ?? '';
	const PlG = result?.wordForms?.find((wordForm) => wordForm.code === 'PlG')?.value ?? '';

	const SgP = result?.wordForms?.find((wordForm) => wordForm.code === 'SgP')?.value ?? '';
	const PlP = result?.wordForms?.find((wordForm) => wordForm.code === 'PlP')?.value ?? '';

	const longestFirstColumn = Math.max(SgN.length, SgG.length, SgP.length);
	// SgN PlN
	const wordFormsRow1 = ` ${SgN}${' '.repeat(longestFirstColumn - SgN.length)}  ${PlN} `;
	// SgG PlG
	const wordFormsRow2 = ` ${SgG}${' '.repeat(longestFirstColumn - SgG.length)}  ${PlG} `;
	// SgP PlP
	const wordFormsRow3 = ` ${SgP}${' '.repeat(longestFirstColumn - SgP.length)}  ${PlP} `;

	// find longest row
	const longestWordFormRowLength = Math.max(
		wordFormsRow1.length,
		wordFormsRow2.length,
		wordFormsRow3.length,
		' Forms '.length
	);
	const WordFormHeaderPaddingLeft = Math.floor((longestWordFormRowLength - 5) / 2);
	const WordFormheaderPaddingRight = Math.ceil((longestWordFormRowLength - 5) / 2);
	/**
	 * WORD FORMS END
	 */

	/**
	 * SIMILAR WORD START
	 */
	const firstSixSimilarWords = result?.similarWords.slice(0, 6) ?? [];

	// if array has less than 6 entires, fill with empty strings
	const similarWords = firstSixSimilarWords.concat(Array(6 - firstSixSimilarWords.length).fill(''));

	const longestSimilarWordFirstColumn = Math.max(
		similarWords[0].length,
		similarWords[2].length,
		similarWords[4].length
	);
	// put the 6 words into couples of two
	const similarWordsRow1 = ` ${similarWords[0]}${' '.repeat(
		longestSimilarWordFirstColumn - similarWords[0].length
	)}  ${similarWords[1]} `;
	const similarWordsRow2 = ` ${similarWords[2]}${' '.repeat(
		longestSimilarWordFirstColumn - similarWords[2].length
	)}  ${similarWords[3]} `;
	const similarWordsRow3 = ` ${similarWords[4]}${' '.repeat(
		longestSimilarWordFirstColumn - similarWords[4].length
	)}  ${similarWords[5]} `;

	const longestSimiliarWordsRowLength = Math.max(
		similarWordsRow1.length,
		similarWordsRow2.length,
		similarWordsRow3.length,
		' Similar Words '.length
	);

	const paddingLeft = Math.floor((longestSimiliarWordsRowLength - 13) / 2);
	const paddingRight = Math.ceil((longestSimiliarWordsRowLength - 13) / 2);

	const longestSimiliarWordsPaddingLeft = paddingLeft < 0 ? 1 : paddingLeft;
	const longestSimiliarWordsPaddingRight = paddingRight < 0 ? 1 : paddingRight;
	/**
	 * SIMILAR WORD END
	 */

	/**
	 * EXAMPLES start
	 */

	const collectedExamples = collectExamples(result?.meanings ?? []);

	const examples = collectedExamples.concat(Array(3 - collectedExamples.length).fill(''));

	const examplesRow1 = ` ${examples[0] ?? ''} `;
	const examplesRow2 = ` ${examples[1] ?? ''} `;
	const examplesRow3 = ` ${examples[2] ?? ''} `;

	const longestExampleLength = Math.max(
		examplesRow1.length,
		examplesRow2.length,
		examplesRow3.length,
		' Examples '.length
	);

	const longestExamplesPaddingLeft =
		Math.floor((longestExampleLength - 8) / 2) < 0 ? 1 : Math.floor((longestExampleLength - 8) / 2);
	const longestExamplesPaddingRight =
		Math.ceil((longestExampleLength - 8) / 2) < 0 ? 1 : Math.ceil((longestExampleLength - 8) / 2);
	/**
	 * EXAMPLES End
	 */

	/**
	 * TRANSLATIONS START
	 */

	const collectedTranslations = searchResult?.translations[0].translations ?? [];

	const translationRow1 = ` ${collectedTranslations[0] ?? ''} `;
	const translationRow2 = ` ${collectedTranslations[1] ?? ''} `;
	const translationRow3 = ` ${collectedTranslations[2] ?? ''} `;

	const longestTranslationLength = Math.max(
		translationRow1.length,
		translationRow2.length,
		translationRow3.length,
		' Translations '.length
	);

	const longestTranslationsPaddingLeft =
		Math.floor((longestTranslationLength - 12) / 2) < 0 ? 1 : Math.floor((longestTranslationLength - 12) / 2);
	const longestTranslationsPaddingRight =
		Math.ceil((longestTranslationLength - 12) / 2) < 0 ? 1 : Math.ceil((longestTranslationLength - 12) / 2);

	/**
	 * TRANSLATIONS END
	 */

	const HeaderBox =
		`┌${'─'.repeat(longestWordFormRowLength)}─${'─'.repeat(longestSimiliarWordsRowLength)}─${'─'.repeat(
			longestExampleLength
		)}─${'─'.repeat(longestTranslationLength)}┐\n` +
		`│${' '.repeat(WordFormHeaderPaddingLeft)}Forms${' '.repeat(WordFormheaderPaddingRight)}│${' '.repeat(
			longestSimiliarWordsPaddingLeft
		)}Similar Words${' '.repeat(longestSimiliarWordsPaddingRight)}│${' '.repeat(
			longestExamplesPaddingLeft
		)}Examples${' '.repeat(longestExamplesPaddingRight)}│${' '.repeat(
			longestTranslationsPaddingLeft
		)}Translations${' '.repeat(longestTranslationsPaddingRight)}│\n`;
	// `└${'─'.repeat(longestWordFormRowLength)}┘\n`;

	const dividerLine = `├${'─'.repeat(longestWordFormRowLength)}─${'─'.repeat(
		longestSimiliarWordsRowLength
	)}─${'─'.repeat(longestExampleLength)}─${'─'.repeat(longestTranslationLength)}┤\n`;

	const bottomLine = `└${'─'.repeat(longestWordFormRowLength)}─${'─'.repeat(
		longestSimiliarWordsRowLength
	)}─${'─'.repeat(longestExampleLength)}─${'─'.repeat(longestTranslationLength)}┘\n`;

	const mainBox =
		`│${wordFormsRow1}${' '.repeat(
			longestWordFormRowLength - wordFormsRow1.length
		)}│${similarWordsRow1}${' '.repeat(
			longestSimiliarWordsRowLength - similarWordsRow1.length
		)}│${examplesRow1}${' '.repeat(longestExampleLength - examplesRow1.length)}│${translationRow1}${' '.repeat(
			longestTranslationLength - translationRow1.length
		)}│\n` +
		`│${wordFormsRow2}${' '.repeat(
			longestWordFormRowLength - wordFormsRow2.length
		)}│${similarWordsRow2}${' '.repeat(
			longestSimiliarWordsRowLength - similarWordsRow2.length
		)}│${examplesRow2}${' '.repeat(longestExampleLength - examplesRow2.length)}│${translationRow2}${' '.repeat(
			longestTranslationLength - translationRow2.length
		)}│\n` +
		`│${wordFormsRow3}${' '.repeat(
			longestWordFormRowLength - wordFormsRow3.length
		)}│${similarWordsRow3}${' '.repeat(
			longestSimiliarWordsRowLength - similarWordsRow3.length
		)}│${examplesRow3}${' '.repeat(longestExampleLength - examplesRow3.length)}│${translationRow3}${' '.repeat(
			longestTranslationLength - translationRow3.length
		)}│\n`;

	return HeaderBox + dividerLine + mainBox + bottomLine;
};
