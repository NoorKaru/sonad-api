import DictionaryV2Factory from '@lib/dictionary/infrastructure/ekilex/index';
import TranslatorFactory from '@lib/dictionary/infrastructure/translator/index';
import RateLimiterFactory from '@lib/primary-adapters/http/infrastructure/rate-limiter/index';
import DictionaryCacheFactory from '@lib/dictionary/infrastructure/cache/index';
import LoggerFactory from '@lib/dictionary/infrastructure/logger/index';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import RateLimiterCacheInterface from '@lib/primary-adapters/http/ports/rate-limiter.interface';
import TranslatorService from '@lib/dictionary/application/translator-service';
import DictionaryV2Service from '@lib/dictionary/application/dictionary-v2-service';
import RequestLoggerFactory from '@lib/dictionary/infrastructure/request-logger';
import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import { AsciiPort } from '@lib/dictionary/application/ports/ascii.port';
import { AsciiService } from '@lib/dictionary/infrastructure/ascii/ascii-service';
import DictionaryCacheInterface from '@lib/dictionary/application/ports/dictionary-cache.interface';
import RoutingBus from '@lib/dictionary/infrastructure/bus/routing-bus';
import LoggerBus from '@lib/dictionary/infrastructure/bus/logger-bus';
import RetryBus from '@lib/dictionary/infrastructure/bus/retry-bus';
import { GetDictionaryEntryQuery } from '@lib/dictionary/application/queries/get-dictionary-entry-query';
import { GetDictionaryQueryHandler } from '@lib/dictionary/application/queries/get-dictionary-entry-handler';
import EtymologyFactory from '@lib/etymology/infrastructure/ekilex/index';
import EtymologyService from '@lib/etymology/application/etymology-service';

export type Services = {
	dictionaryV2Service: DictionaryV2Service;
	translatorService: TranslatorService;
	asciiService: AsciiPort;
	dictionaryCache: DictionaryCacheInterface;
	logger: LoggerInterface;
	rateLimiter: RateLimiterCacheInterface;
	requestLogger: RequestLogger;
	etymologyService: EtymologyService;
};

export async function buildServices(): Promise<Services> {
	const logger = LoggerFactory.getLogger();
	const dictionaryV2 = await DictionaryV2Factory.getDictionary(logger);
	const requestLogger = await RequestLoggerFactory.getRequestLogger(logger);
	const dictionaryCache = DictionaryCacheFactory.getDictionaryCache();
	const translator = await TranslatorFactory.getTranslator(logger);

	const queries = new Map();
	queries.set(GetDictionaryEntryQuery.name, new GetDictionaryQueryHandler(dictionaryV2, dictionaryCache, logger));
	const bus = new RetryBus(new LoggerBus(logger, new RoutingBus(new Map(), queries)));

	const etymologyAdapter = EtymologyFactory.getAdapter(logger);

	return {
		dictionaryV2Service: new DictionaryV2Service(bus),
		translatorService: new TranslatorService(translator, logger),
		asciiService: new AsciiService(),
		dictionaryCache,
		logger,
		rateLimiter: RateLimiterFactory.getRateLimiter(),
		requestLogger,
		etymologyService: new EtymologyService(etymologyAdapter),
	};
}
