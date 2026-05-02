/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from './command.interface.js';
import { Query } from './query.interface.js';
import { CommandHandlerResponse } from './command-handler.interface.js';
import { QueryHandlerResponse } from './query-handler.interface.js';

export interface Bus {
	execute(object: Command | Query): Promise<CommandHandlerResponse | QueryHandlerResponse>;
}
