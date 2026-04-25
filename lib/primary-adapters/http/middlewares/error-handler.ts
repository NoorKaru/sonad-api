import { Request, Response, NextFunction } from 'express';

export class CustomError {
	message!: string;
	status!: number;

	constructor(message: string, status = 500) {
		this.message = message;
		this.status = status;
	}
}

const errorHandler = (err: TypeError | CustomError, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof CustomError) {
		return res.status((err as CustomError).status).send(err);
	}

	return res.status(500).send({
		message: 'Server error',
		status: 500,
	});
};

export default errorHandler;
