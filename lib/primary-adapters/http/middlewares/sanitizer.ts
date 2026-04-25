import { Request, Response, NextFunction } from 'express';

const escapeHtml = (unsafe: any): string => {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
};

const sanitizer = async (req: Request, res: Response, next: NextFunction) => {
	for (const key in req.params) {
		req.params[key] = escapeHtml(req.params[key]);
	}

	next();
};

export default sanitizer;
