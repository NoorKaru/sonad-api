import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Same zod-compat depth issue as register-tools.ts — cast to any to bypass.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyServer = any;

export function registerPrompts(server: McpServer): void {
	const s = server as AnyServer;

	s.registerPrompt(
		'explain_word',
		{
			title: 'Explain Estonian Word',
			description:
				'Comprehensive explanation of an Estonian word: meaning, all grammatical forms, synonyms, and usage examples.',
			argsSchema: {
				word: z.string().describe('The Estonian word to explain'),
			},
		},
		({ word }: { word: string }) => ({
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Please explain the Estonian word "${word}" comprehensively.

Use the available tools in this order:
1. Call lookup_word("${word}") to get the full dictionary entry with meanings and examples.
2. Call get_word_forms("${word}") to get the complete declension or conjugation table.
3. Call find_synonyms("${word}") to find related words.

Then present a structured explanation covering:
- What the word means (all senses if multiple)
- Its word class (noun, verb, adjective, etc.)
- Key grammatical forms (at minimum: nominative, genitive, partitive for nouns; ma/da/b forms for verbs)
- Synonyms and similar words
- Any usage examples from the dictionary`,
					},
				},
			],
		})
	);

	s.registerPrompt(
		'grammar_drill',
		{
			title: 'Estonian Grammar Drill',
			description:
				'Full declension or conjugation table for an Estonian word with example sentences for each case.',
			argsSchema: {
				word: z.string().describe('The Estonian word to drill'),
			},
		},
		({ word }: { word: string }) => ({
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Create a grammar drill for the Estonian word "${word}".

1. Call get_word_forms("${word}") to retrieve all grammatical forms.
2. Also read the resource estonian://grammar/cases for the case reference.

Present:
- A complete table of all forms (singular and plural where applicable)
- For each case: the case name in Estonian and English, the question word, and one example sentence using that form of "${word}"
- For verbs: present all conjugation forms with example sentences

Format this as a clear study reference a language learner can use.`,
					},
				},
			],
		})
	);

	s.registerPrompt(
		'vocabulary_in_context',
		{
			title: 'Vocabulary in Context',
			description: 'Explain the key Estonian vocabulary in a sentence or short text, with forms and meanings.',
			argsSchema: {
				text: z.string().describe('An Estonian sentence or short text to analyse'),
			},
		},
		({ text }: { text: string }) => ({
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Analyse the vocabulary in this Estonian text: "${text}"

For each content word (nouns, verbs, adjectives — skip common particles and conjunctions):
1. Identify the base form (dictionary form / nominative singular or ma-infinitive)
2. Call lookup_word(<base_form>) to get the meaning
3. Note which grammatical form is used in the sentence and why

Present a breakdown that helps a language learner understand both the vocabulary and the grammar at work in this sentence.`,
					},
				},
			],
		})
	);
}
