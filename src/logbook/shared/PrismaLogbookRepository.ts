import { ILogbookRepository } from './ILogbookRepository';
import { Logbook } from '../domain/Logbook';
import { PrismaClient } from '@prisma/client';

export class PrismaLogbookRepository implements ILogbookRepository {
	constructor(
		private readonly _prismaClient: PrismaClient,
	) { }

	public async find(id: string): Promise<Logbook | null> {
		const logbook = await this._prismaClient.logbook.findUnique({
			where: {
				id: id,
			}
		});
		if (!logbook) {
			return logbook;
		}
		return new Logbook(logbook.name, logbook.userId, logbook.id);
	}

	public async save(logbook: Logbook): Promise<boolean> {
		await this._prismaClient.logbook.create({
			data: {
				id: logbook.id,
				name: logbook.name,
				userId: logbook.userId,
			}
		});
		return true;
	}

}