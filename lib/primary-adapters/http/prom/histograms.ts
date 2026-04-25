import promClient from 'prom-client';

const createHistogram = ({
	name,
	help,
	labelNames,
	buckets,
}: {
	name: string;
	help: string;
	labelNames: string[];
	buckets: number[];
}) =>
	new promClient.Histogram({
		name,
		help,
		labelNames,
		buckets,
	});
const createLinearBuckets = (bucketStart: number, bucketWidth: number, numberOfBuckets: number) =>
	promClient.linearBuckets(bucketStart, bucketWidth, numberOfBuckets);

const LABELS = ['route', 'method', 'statusCode'];

const BUCKET_START = 100;

const BUCKET_WIDTH = 200;

const BUCKET_COUNT = 40;

const requestDuration = createHistogram({
	name: 'sonad_api_http_request_duration_ms',
	help: `Duration of sonad-api requests in ms`,

	buckets: createLinearBuckets(BUCKET_START, BUCKET_WIDTH, BUCKET_COUNT),
	labelNames: LABELS,
});

export { requestDuration };
