import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { Bus } from '@lib/shared/bus/bus.interface';
import { Command } from '@lib/shared/bus/command.interface';
import { Query } from '@lib/shared/bus/query.interface';
import { QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';

export default class RetryBus implements Bus {
	private maxRetries: number;
	private bus: Bus;

	constructor(bus: Bus, maxRetries = 3) {
		this.maxRetries = maxRetries;
		this.bus = bus;
	}

	async execute(object: Command | Query): Promise<CommandHandlerResponse | QueryHandlerResponse> {
		return this.executeWithRetry(0, object);
	}

	async executeWithRetry(
		retries: number,
		object: Command | Query
	): Promise<CommandHandlerResponse | QueryHandlerResponse> {
		try {
			return await this.bus.execute(object);
		} catch (error) {
			// TODO this can be improved by checking specific error, and only retry if not known errors which will alway fail
			if (retries < this.maxRetries) {
				const retry = retries + 1;
				return this.executeWithRetry(retry, object);
			}
			throw error;
		}
	}
}
