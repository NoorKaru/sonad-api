import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import EtymologyPort from '@lib/etymology/application/ports/etymology.port';
import EkiScraperAdapter from '@lib/etymology/infrastructure/eki-scraper/eki-scraper-adapter';
import InMemoryEtymologyAdapter from './in-memory/in-memory-etymology-adapter';
import config from '@lib/global-config';

export default {
	getAdapter(logger: LoggerInterface): EtymologyPort {
		if (config.ekilex.apiKey) {
			return new EkiScraperAdapter(logger);
		}

		return new InMemoryEtymologyAdapter();
	},
};
