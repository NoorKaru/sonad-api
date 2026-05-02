import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import EtymologyPort from '@lib/etymology/application/ports/etymology.port';
import { EtymologyEntry, EtyCognate } from '@lib/etymology/domain/etymology-entry';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';

const ARCHIVE_URL = 'https://arhiiv.eki.ee/dict/ety/index.cgi';

export default class EkiScraperAdapter implements EtymologyPort {
	constructor(private readonly logger: LoggerInterface) {}

	async getEtymology(word: string): Promise<EtymologyEntry[]> {
		try {
			const url = `${ARCHIVE_URL}?Q=${encodeURIComponent(word)}&F=M&C06=et`;
			const res = await fetch(url);
			const html = await res.text();
			const entries = this.parse(html);
			this.logger.info({
				message: `Etymology scraped for "${word}": ${entries.length} entries`,
				context: 'ETYMOLOGY',
			});
			return entries;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this.logger.error({ message: `Etymology scrape failed for "${word}": ${message}`, context: 'ETYMOLOGY' });
			throw err;
		}
	}

	private parse(html: string): EtymologyEntry[] {
		const root = parse(html);
		const entries: EtymologyEntry[] = [];

		for (const articleEl of root.querySelectorAll('.tervikart')) {
			const p = articleEl.querySelector('p');
			if (!p) continue;

			const headword = articleEl.querySelector('.e_m')?.text.trim() ?? '';
			const inflectionForms = articleEl.querySelectorAll('.e_mv').map((el) => el.text.trim());

			const definitions: string[] = [];
			const cognates: EtyCognate[] = [];
			let etymNote = '';
			const seeAlso: string[] = [];

			let currentCognate: EtyCognate | null = null;
			let seenFirstCognate = false;
			let seenEtymNote = false;
			let questionablePending = false;

			for (const node of p.childNodes) {
				if (node.nodeType === 3) {
					const text = node.text;
					if (!seenFirstCognate && text.includes('?')) {
						questionablePending = true;
					}
					if (seenEtymNote) {
						etymNote += text;
					}
					continue;
				}

				if (node.nodeType !== 1) continue;

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const el = node as any;
				const cls: string = el.getAttribute?.('class') ?? '';

				if (cls.includes('e_m') || cls.includes('e_mv')) continue;

				if (cls.includes('kp_e_k')) {
					if (!seenEtymNote) {
						if (currentCognate) cognates.push(currentCognate);
						seenFirstCognate = true;
						currentCognate = {
							language: el.text.trim(),
							words: [],
							meanings: [],
							questionable: questionablePending,
						};
						questionablePending = false;
					} else {
						etymNote += el.text;
					}
					continue;
				}

				if (cls.includes('e_x')) {
					if (currentCognate && !seenEtymNote) {
						currentCognate.words.push(el.text.trim());
					} else if (seenEtymNote) {
						etymNote += el.text;
					}
					continue;
				}

				if (cls.includes('e_gl')) {
					if (!seenFirstCognate) {
						definitions.push(el.text.trim());
					} else if (currentCognate && !seenEtymNote) {
						currentCognate.meanings.push(el.text.trim());
					} else if (seenEtymNote) {
						etymNote += el.text;
					}
					continue;
				}

				if (cls.includes('e_co')) {
					const text: string = el.text;
					if (!seenEtymNote && text.trim().length > 5) {
						seenEtymNote = true;
						if (currentCognate) {
							cognates.push(currentCognate);
							currentCognate = null;
						}
					}
					if (seenEtymNote) {
						etymNote += text;
					}
					continue;
				}

				if (cls.includes('cvt_e_cvtl') || cls.includes('e_cvt_e_cvtl')) continue;

				if (cls.includes('cvt') && cls.includes('lingike')) {
					const link = el.querySelector?.('a');
					if (link) seeAlso.push(link.text.trim());
					continue;
				}
			}

			if (currentCognate) cognates.push(currentCognate);

			entries.push({
				headword,
				inflectionForms,
				definitions,
				cognates,
				etymNote: etymNote.trim(),
				seeAlso,
			});
		}

		return entries;
	}
}
