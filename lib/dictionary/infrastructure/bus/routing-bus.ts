import { Bus } from '@lib/shared/bus/bus.interface';
import { CommandHandler } from '@lib/shared/bus/command-handler.interface';
import { Command } from '@lib/shared/bus/command.interface';
import { QueryHandler, QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';
import { Query } from '@lib/shared/bus/query.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';

export default class RoutingBus implements Bus {
	private commandHandlerLookup: Map<string, CommandHandler<Command>> = new Map();
	private queryHandlerLookup: Map<string, QueryHandler<Query>> = new Map();

	constructor(
		commands: Map<string, CommandHandler<Command>> = new Map(),
		queries: Map<string, QueryHandler<Query>> = new Map()
	) {
		this.commandHandlerLookup = commands;
		this.queryHandlerLookup = queries;
	}
	registerCommandHandler(commandName: string, handler: CommandHandler<Command>): void {
		this.commandHandlerLookup.set(commandName, handler);
	}

	registerQueryHandler(queryName: string, handler: QueryHandler<Query>): void {
		this.queryHandlerLookup.set(queryName, handler);
	}
	async execute(object: Command | Query): Promise<CommandHandlerResponse | QueryHandlerResponse> {
		if (this.isQuery(object)) {
			return this.executeQuery(object);
		}

		if (this.isCommand(object)) {
			return this.executeCommand(object);
		}

		throw new Error(`Wrong type`);
	}

	private isQuery(object: Query | Command): object is Query {
		return object._type === 'query';
	}

	private isCommand(object: Query | Command): object is Command {
		return object._type === 'command';
	}

	private executeQuery(query: Query): Promise<QueryHandlerResponse> {
		const name = query.constructor.name;

		const queryHandler = this.queryHandlerLookup.get(name);

		if (!queryHandler) {
			throw new Error('No Query Handler found for');
		}

		return queryHandler.execute(query);
	}

	private executeCommand(command: Command): Promise<CommandHandlerResponse> {
		const name = command.constructor.name;

		const commandHandler = this.commandHandlerLookup.get(name);

		if (!commandHandler) {
			throw new Error('No Command Handler found for');
		}

		return commandHandler.execute(command);
	}
}
