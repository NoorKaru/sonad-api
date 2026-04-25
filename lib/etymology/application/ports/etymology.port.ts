import { EtymologyEntry } from '@lib/etymology/domain/etymology-entry';

export default interface EtymologyPort {
	getEtymology(word: string): Promise<EtymologyEntry[]>;
}
