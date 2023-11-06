import { GetLogbookUseCase } from './GetLogbookUseCase';
import { Request, Response } from 'express';

export interface IController{
    handle(req: Request, res: Response): Promise<void>;
}


export class GetLogbookController implements IController {
	constructor(
        private readonly _getLogbookUseCase: GetLogbookUseCase,
	) { }

	public async handle(req: Request, res: Response): Promise<void> {
		// TODO:input validation
		const result = await this._getLogbookUseCase.execute({
			id: req.body.id,
		});

		res.status(200).json(result);
	}

}