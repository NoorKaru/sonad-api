import { Query } from './query.interface.js';

export type QueryHandlerResponse = {
	success: boolean;
	payload: unknown;
};

export interface QueryHandler<TQuery extends Query> {
	execute(command: TQuery): Promise<QueryHandlerResponse>;
}
