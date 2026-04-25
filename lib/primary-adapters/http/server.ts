import express from 'express';
import { Express } from 'express';
import { Services } from '@lib/config/service-locator';
import router from '@lib/primary-adapters/http/routes/router';

import {
	jsonParser,
	corsHandler,
	bindServices,
	rateLimiter,
	cacheHandler,
	errorHandler,
	metrics,
	requestLogger,
} from '@lib/primary-adapters/http/middlewares/index';

const createServer = (services: Services): Express => {
	const server = express();

	server.disable('etag');
	server.use(metrics());
	server.use(corsHandler);
	server.use(jsonParser);
	server.use(bindServices(services));
	server.use(rateLimiter);
	server.use(requestLogger);
	server.use(cacheHandler);
	router(server, services);
	server.use(errorHandler);

	return server;
};

export default createServer;
