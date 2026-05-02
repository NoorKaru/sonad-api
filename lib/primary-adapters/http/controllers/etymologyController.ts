import { Request, Response, NextFunction } from 'express';
import EtymologyService from '@lib/etymology/application/etymology-service';
import { CustomError } from '../middlewares/error-handler.js';

export default class EtymologyController {
	constructor(private readonly etymologyService: EtymologyService) {}

	getEtymology = () => async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { word } = req.params;
			const result = await this.etymologyService.getEtymology(word);

			if (!result.length) {
				return next(new CustomError(`No etymology found for "${word}"`, 404));
			}

			res.json(result);
		} catch {
			return next(new CustomError('Something went wrong', 500));
		}
	};
}
