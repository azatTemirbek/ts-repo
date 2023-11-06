import { Request, Response } from 'express';
import { CreateLogbookUseCase, ICreateLogbookResult } from './CreateLogbookUsaCase';

export interface IController{
    handle(req: Request, res: Response): Promise<void>;
}

export class CreateLogbookDto implements ICreateLogbookResult{
	public readonly logbookId: string;
	constructor(logbookId: string){
		this.logbookId = logbookId;
	}
}

export class CreateLogbookController implements IController {
	constructor(
        private readonly _createLogbookUseCase: CreateLogbookUseCase,
	) { }

	public async handle(req: Request, res: Response): Promise<void> {
		// TODO:input validation
		const userId = 'fakeUserId';
		const result = await this._createLogbookUseCase.execute({
			name: req.body.name,
			userId: userId,
		});

		const response: CreateLogbookDto = new CreateLogbookDto(result.logbookId);

		res.status(201).json(response);
	}

}