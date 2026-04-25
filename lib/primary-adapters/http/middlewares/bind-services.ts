import { Request, Response, NextFunction } from 'express';
import { Services } from '@lib/config/service-locator';

const bindServices = (services: Services) => (req: Request, res: Response, next: NextFunction) => {
	req.rateLimiter = services.rateLimiter;
	req.logger = services.logger;
	req.cache = services.dictionaryCache;
	req.requestLogger = services.requestLogger;
	next();
};

export default bindServices;
