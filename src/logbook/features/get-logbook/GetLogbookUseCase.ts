import { Logbook } from '@prisma/client';
import { IUseCase } from '../../../shared/IUseCase';
import { ICreateRepository } from '../../../interfaces/repository/ICreateRepository';

interface IGetLogbookDto {
    id: string;
}

class LogbookDto {
	constructor(
        public readonly id: string,
        public readonly name: string,
	) { }
	public static from(logbook: Logbook): LogbookDto {
		return new LogbookDto(logbook.id, logbook.name);
	}
}

export class GetLogbookUseCase implements IUseCase<IGetLogbookDto, LogbookDto>{
	constructor(
        private readonly _logbookRepo: ICreateRepository,
	) { }
    
	public async execute(input: IGetLogbookDto): Promise<LogbookDto> {
		const logbook = await this._logbookRepo.find(input.id);
		if(!logbook) throw new Error('Logbook not found'); 
        
		return LogbookDto.from(logbook);
	}

}
