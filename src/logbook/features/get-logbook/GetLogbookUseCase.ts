import { Logbook } from '@prisma/client';
import { IUseCase } from '../../../shared/IUseCase';
import { ILogbookRepository } from '../../shared/ILogbookRepository';

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
        private readonly _logbookRepo: ILogbookRepository,
	) { }
    
	public async execute(input: IGetLogbookDto): Promise<LogbookDto> {
		const logbook = await this._logbookRepo.find(input.id);
		if(!logbook) throw new Error('Logbook not found'); 
        
		return LogbookDto.from(logbook);
	}

}
