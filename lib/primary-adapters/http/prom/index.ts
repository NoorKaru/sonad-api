import promClient from 'prom-client';

import { requestCounter } from './counters.js';
import { requestDuration } from './histograms.js';

const register = new promClient.Registry();

register.registerMetric(requestCounter);
register.registerMetric(requestDuration);

const getEnv = (): string => {
	return process?.env?.NODE_ENV ?? 'development';
};

register.setDefaultLabels({ app: 'sonad-api', env: getEnv() });

promClient.collectDefaultMetrics({ register });

// create a port for counter logic and move prom implementation to infrastructure folder inside presentation
export { register, requestCounter, requestDuration };
