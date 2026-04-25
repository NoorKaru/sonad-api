import { McpServer, ResourceTemplate } from './sdk-shim';
import { Services } from '@lib/config/service-locator';

const GRAMMAR_CASES_CONTENT = `# Estonian Grammatical Cases

Estonian has 14 grammatical cases. Each case answers specific questions and expresses a grammatical relationship.

| # | Case (Estonian) | Case (English) | Questions | Usage |
|---|-----------------|----------------|-----------|-------|
| 1 | Nimetav | Nominative | kes? mis? | Subject of the sentence |
| 2 | Omastav | Genitive | kelle? mille? | Possession, direct object (total) |
| 3 | Osastav | Partitive | keda? mida? | Partial object, negation, plural |
| 4 | Sisseütlev | Illative | kellesse? millesse? kuhu? | Movement into something |
| 5 | Seesütlev | Inessive | kelles? milles? kus? | Location inside something |
| 6 | Seestütlev | Elative | kellest? millest? kust? | Movement out from inside |
| 7 | Alaleütlev | Allative | kellele? millele? kuhu? | Movement onto a surface / giving to |
| 8 | Alalütlev | Adessive | kellel? millel? kus? | Location on a surface / possession |
| 9 | Alaltütlev | Ablative | kellelt? millelt? kust? | Movement from a surface / taking from |
| 10 | Saav | Translative | kelleks? milleks? | Transformation, becoming something |
| 11 | Rajav | Terminative | kelleni? milleni? kuhu? | Up to a limit ("as far as") |
| 12 | Olev | Essive | kellena? millena? | State or role ("as a/an …") |
| 13 | Ilmaütlev | Abessive | kelleta? milleta? | Without ("without a/an …") |
| 14 | Kaasaütlev | Comitative | kellega? millega? | Together with ("with a/an …") |

## Example word: "maja" (house)

| Case | Singular | Plural |
|------|----------|--------|
| Nominative | maja | majad |
| Genitive | maja | majade |
| Partitive | maja | maju |
| Illative | majasse | majadesse |
| Inessive | majas | majades |
| Elative | majast | majadest |
| Allative | majale | majadele |
| Adessive | majal | majadel |
| Ablative | majalt | majadelt |
| Translative | majaks | majadeks |
| Terminative | majani | majadeni |
| Essive | majana | majadena |
| Abessive | majata | majadeta |
| Comitative | majaga | majadega |
`;

export function registerResources(server: McpServer, services: Services): void {
	const { dictionaryV2Service } = services;

	server.registerResource(
		'word_entry',
		new ResourceTemplate('estonian://words/{word}', { list: undefined }),
		{ description: 'Full Ekilex dictionary entry for an Estonian word as structured JSON.' },
		async (uri, variables) => {
			const word = variables.word as string;
			const result = await dictionaryV2Service.searchWordQuery(word);
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(result ?? [], null, 2),
					},
				],
			};
		},
	);

	server.registerResource(
		'word_forms',
		new ResourceTemplate('estonian://words/{word}/forms', { list: undefined }),
		{
			description:
				'Declension or conjugation table for an Estonian word — all grammatical forms with morph codes.',
		},
		async (uri, variables) => {
			const word = variables.word as string;
			const result = await dictionaryV2Service.searchWordQuery(word);
			const forms = result?.flatMap((entry) => (entry.wordForms as unknown[]) ?? []) ?? [];
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(forms, null, 2),
					},
				],
			};
		},
	);

	server.registerResource(
		'grammar_cases',
		'estonian://grammar/cases',
		{ description: 'Reference: all 14 Estonian grammatical cases with questions and usage.' },
		async (uri) => ({
			contents: [
				{
					uri: uri.href,
					mimeType: 'text/markdown',
					text: GRAMMAR_CASES_CONTENT,
				},
			],
		}),
	);
}
