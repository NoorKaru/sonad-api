import { McpServer } from './sdk-shim';
import { z } from 'zod';
import { Services } from '@lib/config/service-locator';

// The MCP SDK's zod-compat layer (supporting both zod v3 and v4 simultaneously) causes
// TypeScript to hit its instantiation depth limit when resolving registerTool generics.
// Casting to any inside this module bypasses that while keeping the public API typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyServer = any;

export function registerTools(server: McpServer, services: Services): void {
	const s = server as AnyServer;
	const { dictionaryV2Service, translatorService, asciiService, etymologyService } = services;

	s.registerTool(
		'lookup_word',
		{
			title: 'Look Up Estonian Word',
			description:
				'Fetch the full Ekilex dictionary entry for an Estonian word: word class, all meanings, usage examples, synonyms, and similar words.',
			inputSchema: { word: z.string().describe('The Estonian word to look up') },
			annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: true },
		},
		async ({ word }: { word: string }) => {
			try {
				const result = await dictionaryV2Service.searchWordQuery(word);
				if (!result || result.length === 0) {
					return {
						isError: true,
						content: [{ type: 'text', text: `No dictionary entry found for "${word}".` }],
					};
				}
				return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
			} catch {
				return { isError: true, content: [{ type: 'text', text: `Failed to look up "${word}".` }] };
			}
		}
	);

	s.registerTool(
		'get_word_forms',
		{
			title: 'Get Estonian Word Forms',
			description:
				'Get the complete declension or conjugation table for an Estonian word — all 14 grammatical cases for nouns/adjectives, or all verb forms.',
			inputSchema: { word: z.string().describe('The Estonian word') },
			annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: true },
		},
		async ({ word }: { word: string }) => {
			try {
				const result = await dictionaryV2Service.searchWordQuery(word);
				if (!result || result.length === 0) {
					return {
						isError: true,
						content: [{ type: 'text', text: `No forms found for "${word}".` }],
					};
				}
				const forms = result.flatMap((entry) => (entry.wordForms as unknown[]) ?? []);
				return { content: [{ type: 'text', text: JSON.stringify(forms, null, 2) }] };
			} catch {
				return { isError: true, content: [{ type: 'text', text: `Failed to get forms for "${word}".` }] };
			}
		}
	);

	s.registerTool(
		'find_synonyms',
		{
			title: 'Find Estonian Synonyms',
			description:
				'Find synonyms and semantically related words for an Estonian word from the Ekilex synonym groups.',
			inputSchema: { word: z.string().describe('The Estonian word') },
			annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: true },
		},
		async ({ word }: { word: string }) => {
			try {
				const result = await dictionaryV2Service.searchWordQuery(word);
				if (!result || result.length === 0) {
					return {
						isError: true,
						content: [{ type: 'text', text: `No synonyms found for "${word}".` }],
					};
				}
				const synonyms = result.flatMap((entry) =>
					((entry.meanings as { synonyms?: string[] }[]) ?? []).flatMap((m) => m.synonyms ?? [])
				);
				const similarWords = result.flatMap((entry) => (entry.similarWords as string[]) ?? []);
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(
								{ synonyms: [...new Set(synonyms)], similarWords: [...new Set(similarWords)] },
								null,
								2
							),
						},
					],
				};
			} catch {
				return { isError: true, content: [{ type: 'text', text: `Failed to find synonyms for "${word}".` }] };
			}
		}
	);

	s.registerTool(
		'translate_word',
		{
			title: 'Translate Word',
			description: 'Translate a word between Estonian and English using the built-in translation database.',
			inputSchema: {
				word: z.string().describe('The word to translate'),
				from: z.enum(['et', 'en']).describe('Source language: "et" for Estonian, "en" for English'),
				to: z.enum(['et', 'en']).describe('Target language: "et" for Estonian, "en" for English'),
			},
			annotations: { readOnlyHint: true, idempotentHint: true },
		},
		async ({ word, from, to }: { word: string; from: 'et' | 'en'; to: 'et' | 'en' }) => {
			try {
				const result = await translatorService.getTranslations(word, from, to);
				if (result.isLeft()) {
					return { isError: true, content: [{ type: 'text', text: result.payload.message }] };
				}
				return { content: [{ type: 'text', text: JSON.stringify(result.payload, null, 2) }] };
			} catch {
				return { isError: true, content: [{ type: 'text', text: `Failed to translate "${word}".` }] };
			}
		}
	);

	s.registerTool(
		'get_etymology',
		{
			title: 'Get Estonian Word Etymology',
			description:
				'Look up the etymological origin of an Estonian word from the EKI etymological dictionary (dataset: ety). Returns definitions and usage examples explaining the word\'s origin and historical development.',
			inputSchema: { word: z.string().describe('The Estonian word to look up etymology for') },
			annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: true },
		},
		async ({ word }: { word: string }) => {
			try {
				const result = await etymologyService.getEtymology(word);
				if (!result.length) {
					return {
						isError: true,
						content: [{ type: 'text', text: `No etymology found for "${word}".` }],
					};
				}
				return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
			} catch {
				return { isError: true, content: [{ type: 'text', text: `Failed to fetch etymology for "${word}".` }] };
			}
		}
	);

	s.registerTool(
		'get_ascii',
		{
			title: 'Get ASCII Word Display',
			description:
				'Get a formatted ASCII text table of a dictionary entry — word forms, meanings, and synonyms in plain text.',
			inputSchema: { word: z.string().describe('The Estonian word') },
			annotations: { readOnlyHint: true, idempotentHint: true },
		},
		async ({ word }: { word: string }) => {
			try {
				const result = await dictionaryV2Service.searchWordQuery(word);
				if (!result || result.length === 0) {
					return { isError: true, content: [{ type: 'text', text: `No entry found for "${word}".` }] };
				}
				const dictionaryResponse = {
					searchResult: result as Parameters<typeof asciiService.getAsciiResponse>[0]['searchResult'],
					translations: [],
					requestedWord: word,
					estonianWord: word,
				};
				const ascii = asciiService.getAsciiResponse(dictionaryResponse);
				return { content: [{ type: 'text', text: ascii }] };
			} catch {
				return { isError: true, content: [{ type: 'text', text: `Failed to get ASCII for "${word}".` }] };
			}
		}
	);
}
