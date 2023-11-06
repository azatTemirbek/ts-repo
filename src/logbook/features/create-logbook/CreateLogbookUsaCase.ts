import { Logbook } from '../../domain/Logbook';
import { IUseCase } from '../../../shared/IUseCase';
import { ILogbookRepository } from '../../shared/ILogbookRepository';

interface ICreateLogbookDto {
    name: string;
    userId: string;
}

export interface ICreateLogbookResult {
    logbookId: string;
}

export class CreateLogbookUseCase implements IUseCase<ICreateLogbookDto, ICreateLogbookResult> {
	constructor(private readonly _logbookRepo: ILogbookRepository) { }
	public async execute(input: ICreateLogbookDto): Promise<ICreateLogbookResult> {
		//TODO: business logic
		const logbook = new Logbook(input.name, input.userId);

		const result = await this._logbookRepo.save(logbook);

		if(result === false) throw new Error('Logbook could not be saved');

		return {
			logbookId: logbook.id,
		};
	}
}