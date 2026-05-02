import EtymologyPort from './ports/etymology.port.js';
import { EtymologyEntry } from '@lib/etymology/domain/etymology-entry';

export default class EtymologyService {
	constructor(private readonly port: EtymologyPort) {}

	async getEtymology(word: string): Promise<EtymologyEntry[]> {
		return this.port.getEtymology(word);
	}
}
