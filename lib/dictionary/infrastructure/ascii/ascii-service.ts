import { AsciiBuiler } from './builder/header.js';
import { collectExamples } from './collect-examples.js';
import { AsciiPort, DictionaryResponse, SearchResult } from '@lib/dictionary/application/ports/ascii.port';

export class AsciiService implements AsciiPort {
	private getWordFormsRows(searchResult: SearchResult | undefined): string[] {
		if (!searchResult) {
			return ['', '', ''];
		}
		let row1Column1 = '';
		let row1Column2 = '';
		let row2Column1 = '';
		let row2Column2 = '';
		let row3Column1 = '';
		let row3Column2 = '';

		if (searchResult.wordClasses.includes('noomen')) {
			row1Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'SgN')?.value ?? '';
			row1Column2 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'PlN')?.value ?? '';

			row2Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'SgG')?.value ?? '';
			row2Column2 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'PlG')?.value ?? '';

			row3Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'SgP')?.value ?? '';
			row3Column2 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'PlP')?.value ?? '';
		}

		if (searchResult.wordClasses.includes('verb')) {
			row1Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'Sup')?.value ?? '';
			row1Column2 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'IndIpfSg3')?.value ?? '';

			row2Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'Inf')?.value ?? '';
			row2Column2 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'PtsPtIps')?.value ?? '';

			row3Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'IndPrSg3')?.value ?? '';
			row3Column2 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'PtsPtPs')?.value ?? '';
		}

		if (searchResult.wordClasses.includes('muutumatu')) {
			row1Column1 = searchResult?.wordForms?.find((wordForm) => wordForm.code === 'ID')?.value ?? '';
		}

		const longestFirstColumn = Math.max(row1Column1.length, row2Column1.length, row3Column1.length);

		// SgN PlN
		const wordFormsRow1 = ` ${row1Column1}${' '.repeat(longestFirstColumn - row1Column1.length)}  ${row1Column2} `;
		// SgG PlG
		const wordFormsRow2 = ` ${row2Column1}${' '.repeat(longestFirstColumn - row2Column1.length)}  ${row2Column2} `;
		// SgP PlP
		const wordFormsRow3 = ` ${row3Column1}${' '.repeat(longestFirstColumn - row3Column1.length)}  ${row3Column2} `;

		return [wordFormsRow1, wordFormsRow2, wordFormsRow3];
	}

	private getSimilarWordsRows(searchResult: SearchResult | undefined): string[] {
		const firstSixSimilarWords = searchResult?.similarWords.slice(0, 6) ?? [];

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

		return [similarWordsRow1, similarWordsRow2, similarWordsRow3];
	}

	private getExamplesRows(searchResult: SearchResult | undefined): string[] {
		const collectedExamples = collectExamples(searchResult?.meanings ?? []);

		const examples = collectedExamples.concat(Array(3 - collectedExamples.length).fill(''));

		const examplesRow1 = ` ${examples[0] ?? ''} `;
		const examplesRow2 = ` ${examples[1] ?? ''} `;
		const examplesRow3 = ` ${examples[2] ?? ''} `;

		return [examplesRow1, examplesRow2, examplesRow3];
	}

	private getTranslationsRows(searchResult: DictionaryResponse | void): string[] {
		const collectedTranslations = searchResult?.translations[0].translations ?? [];

		const translationRow1 = ` ${collectedTranslations[0] ?? ''} `;
		const translationRow2 = ` ${collectedTranslations[1] ?? ''} `;
		const translationRow3 = ` ${collectedTranslations[2] ?? ''} `;

		return [translationRow1, translationRow2, translationRow3];
	}

	public getAsciiResponse(response: DictionaryResponse): string {
		const tables = [];
		for (const result of response.searchResult) {
			const [wordFormsRow1, wordFormsRow2, wordFormsRow3] = this.getWordFormsRows(result);

			const longestWordFormRowLength = Math.max(
				wordFormsRow1.length,
				wordFormsRow2.length,
				wordFormsRow3.length,
				' Forms '.length
			);

			const [similarWordsRow1, similarWordsRow2, similarWordsRow3] = this.getSimilarWordsRows(result);

			const longestSimiliarWordsRowLength = Math.max(
				similarWordsRow1.length,
				similarWordsRow2.length,
				similarWordsRow3.length,
				' Similar Words '.length
			);

			const [examplesRow1, examplesRow2, examplesRow3] = this.getExamplesRows(result);

			const longestExampleLength = Math.max(
				examplesRow1.length,
				examplesRow2.length,
				examplesRow3.length,
				' Examples '.length
			);

			const [translationRow1, translationRow2, translationRow3] = this.getTranslationsRows(response);

			const longestTranslationLength = Math.max(
				translationRow1.length,
				translationRow2.length,
				translationRow3.length,
				' Translations '.length
			);

			const bottomLine = `└${'─'.repeat(longestWordFormRowLength)}─${'─'.repeat(
				longestSimiliarWordsRowLength
			)}─${'─'.repeat(longestExampleLength)}─${'─'.repeat(longestTranslationLength)}┘\n`;

			const mainBox =
				`│${wordFormsRow1}${' '.repeat(
					longestWordFormRowLength - wordFormsRow1.length
				)}│${similarWordsRow1}${' '.repeat(
					longestSimiliarWordsRowLength - similarWordsRow1.length
				)}│${examplesRow1}${' '.repeat(
					longestExampleLength - examplesRow1.length
				)}│${translationRow1}${' '.repeat(longestTranslationLength - translationRow1.length)}│\n` +
				`│${wordFormsRow2}${' '.repeat(
					longestWordFormRowLength - wordFormsRow2.length
				)}│${similarWordsRow2}${' '.repeat(
					longestSimiliarWordsRowLength - similarWordsRow2.length
				)}│${examplesRow2}${' '.repeat(
					longestExampleLength - examplesRow2.length
				)}│${translationRow2}${' '.repeat(longestTranslationLength - translationRow2.length)}│\n` +
				`│${wordFormsRow3}${' '.repeat(
					longestWordFormRowLength - wordFormsRow3.length
				)}│${similarWordsRow3}${' '.repeat(
					longestSimiliarWordsRowLength - similarWordsRow3.length
				)}│${examplesRow3}${' '.repeat(
					longestExampleLength - examplesRow3.length
				)}│${translationRow3}${' '.repeat(longestTranslationLength - translationRow3.length)}│\n`;

			const asciiBuilder = new AsciiBuiler();

			asciiBuilder.setLabel('Forms', longestWordFormRowLength);
			asciiBuilder.setLabel('Similar Words', longestSimiliarWordsRowLength);
			asciiBuilder.setLabel('Examples', longestExampleLength);
			asciiBuilder.setLabel('Translations', longestTranslationLength);

			const Header = asciiBuilder.build();
			tables.push(Header + mainBox + bottomLine);
		}

		return tables.join('\n');
	}
}
