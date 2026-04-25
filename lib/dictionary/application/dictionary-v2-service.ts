import { Bus } from '@lib/shared/bus/bus.interface';
import { GetDictionaryEntryQuery } from './queries/get-dictionary-entry-query';
import { QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';

export type WordResponse = {
	[key in string]: any;
}[];

export default class DictionaryV2Service {
	private routingBus: Bus;

	constructor(routingBus: Bus) {
		this.routingBus = routingBus;
	}

	async searchWordQuery(searchTerm: string): Promise<WordResponse | null> {
		const routingBusResponse = (await this.routingBus.execute(
			new GetDictionaryEntryQuery(searchTerm)
		)) as QueryHandlerResponse;
		const { payload, success } = routingBusResponse;

		if (!success || !payload) {
			return null;
		}
		return routingBusResponse.payload;
	}
}
