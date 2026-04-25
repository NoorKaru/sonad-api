import rateLimiter from '@lib/primary-adapters/http/middlewares/rate-limiter';
import errorHandler from '@lib/primary-adapters/http/middlewares/error-handler';
import bindServices from '@lib/primary-adapters/http/middlewares/bind-services';
import corsHandler from '@lib/primary-adapters/http/middlewares/cors-handler';
import jsonParser from '@lib/primary-adapters/http/middlewares/json-parser';
import cacheHandler from '@lib/primary-adapters/http/middlewares/cache-handler';
import metrics from '@lib/primary-adapters/http/middlewares/metrics';
import sanitizer from '@lib/primary-adapters/http/middlewares/sanitizer';
import requestLogger from '@lib/primary-adapters/http/middlewares/request-logger';

export {
	jsonParser,
	corsHandler,
	bindServices,
	rateLimiter,
	cacheHandler,
	errorHandler,
	metrics,
	sanitizer,
	requestLogger,
};
