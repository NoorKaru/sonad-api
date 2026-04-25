require('module-alias/register');
import createServer from '@lib/primary-adapters/http/server';
import { buildServices } from '@lib/config/service-locator';
import config from './global-config';

(async () => {
	try {
		const services = await buildServices();
		const server = createServer(services);

		const port = config.server.port;
		server.listen(port, () => {
			services.logger.info({
				message: `Server running on port ${port}!`,
				context: 'SERVER_START',
				port,
			});
		});
	} catch (err) {
		/* eslint-disable no-console */
		console.log(err);
		process.exit(1);
	}
})();
