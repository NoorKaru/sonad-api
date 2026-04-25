import { Bus } from '@lib/shared/bus/bus.interface';
import { Command } from '@lib/shared/bus/command.interface';
import { Query } from '@lib/shared/bus/query.interface';
import Logger from '@lib/dictionary/application/ports/logger.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';

export default class LoggerBus implements Bus {
	private logger: Logger;
	private bus: Bus;

	constructor(logger: Logger, bus: Bus) {
		this.logger = logger;
		this.bus = bus;
	}

	async execute(object: Command | Query): Promise<CommandHandlerResponse | QueryHandlerResponse> {
		this.logger.debug({
			message: 'start executing query/command',
			context: 'LoggerBus',
		});

		const result = await this.bus.execute(object);

		this.logger.debug({
			message: 'finished executing query/command',
			context: 'LoggerBus',
		});

		return result;
	}
}
