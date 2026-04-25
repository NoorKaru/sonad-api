import dotenv from 'dotenv';
dotenv.config();
const config = {
	server: {
		port: Number(process.env.SERVER_PORT) || 8083,
		rateLimit: {
			v1: Number(process.env.SERVER_RATE_LIMIT_V1) || 5,
			v2: Number(process.env.SERVER_RATE_LIMIT_V2) || 60,
			url: <string>process.env.SERVER_RATE_LIMIT_URL || '',
		},
	},
	dictionary: {
		v2: <string>process.env.DICTIONARY_V2 || 'ekilex',
	},
	ekilex: {
		apiKey: <string>process.env.EKILEX_API_KEY,
		environment: <'prod' | 'test'>process.env.EKILEX_API_ENVIRONMENT || 'test',
	},
	skippedUrls: <string>process.env.SKIPPED_URLS,
	whiteList: <string>process.env.WHITELIST,
	api: {},
	db: {
		studies: {
			url: <string>process.env.DB_STUDIES_URL || '',
		},
		dictionary: {
			url: <string>process.env.DB_DICTIONARY_URL || '',
		},
		requestLogger: {
			url: <string>process.env.DB_REQUEST_LOGGER_URL || '',
		},
		translator: {
			url: <string>process.env.DB_TRANSLATOR_URL || '',
		},
	},
	cache: {
		url: <string>process.env.CACHE_URL || '',
		ttl: Number(process.env.CACHE_TTL) || 60,
	},
	logger: {
		level: <string>process.env.LOGGER_LEVEL || 'info',
		name: <string>process.env.LOGGER_NAME || 'winston',
		axiom: {
			dataset: <string>process.env.AXIOM_DATASET || 'sonapi',
			token: <string>process.env.AXIOM_TOKEN || '',
		},
	},
};

export default config;
