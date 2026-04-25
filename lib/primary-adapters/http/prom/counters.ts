import promClient from 'prom-client';

const createCounter = ({ name, help, labelNames }: { name: string; help: string; labelNames: string[] }) =>
	new promClient.Counter({
		name,
		help,
		labelNames,
	});

const LABELS = ['route', 'method', 'statusCode'];

const requestCounter = createCounter({
	name: `requests_total`,
	help: `Counter for total requests received`,
	labelNames: LABELS,
});

export { requestCounter };
