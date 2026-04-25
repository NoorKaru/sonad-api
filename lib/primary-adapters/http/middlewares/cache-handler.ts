import { Request, Response, NextFunction } from 'express';

const cacheHandler = async (req: Request, res: Response, next: NextFunction) => {
	const cachedResponse = await req.cache.get(req.originalUrl);

	if (cachedResponse) {
		req.logger.info({
			message: 'Found cached response',
			context: 'CACHE',
			url: req.originalUrl,
		});
		return res.json(JSON.parse(cachedResponse));
	}

	next();
};

export default cacheHandler;
