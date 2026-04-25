import EkiScraperAdapter from '@lib/etymology/infrastructure/eki-scraper/eki-scraper-adapter';
import ConsoleLogger from '@lib/dictionary/infrastructure/logger/consoleLogger/console-logger';

(async () => {
	const logger = new ConsoleLogger();
	const adapter = new EkiScraperAdapter(logger);

	const word = process.argv[2] ?? 'nikerdama';
	console.log(`\n=== Etymology scrape for: ${word} ===`);
	const result = await adapter.getEtymology(word);
	console.log(JSON.stringify(result, null, 2));
})();
