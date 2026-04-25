import express from 'express';
import { Services } from '@lib/config/service-locator';
import { sanitizer } from '@lib/primary-adapters/http/middlewares/index';
import { register } from '@lib/primary-adapters/http/prom';
import DictionaryV2Controller from '../controllers/dictionaryV2Controller';

const routerV2 = express.Router();

const Endpoints = Object.freeze({
	METRICS: '/metrics',
});

const EndpointsV2 = Object.freeze({
	SEARCH: '/:searchTerm',
	GET_LUCKY: '/getLucky',
	ASCII: '/ascii/:searchTerm',
});

export default (server: express.Express, services: Services) => {
	const dictionaryV2Controller = new DictionaryV2Controller(
		services.dictionaryV2Service,
		services.translatorService,
		services.logger,
		services.asciiService
	);

	routerV2.get(EndpointsV2.GET_LUCKY, sanitizer, dictionaryV2Controller.getLucky());
	routerV2.get(EndpointsV2.SEARCH, sanitizer, dictionaryV2Controller.searchWord());
	routerV2.get(EndpointsV2.ASCII, sanitizer, dictionaryV2Controller.ascii());

	server.use(Endpoints.METRICS, async function (req, res) {
		res.setHeader('Content-type', register.contentType);
		res.end(await register.metrics());
	});

	server.use('/v2', routerV2);
};
