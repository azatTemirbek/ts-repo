import { ICrudRepository } from '../../interfaces/repository';
import { Logbook } from '../domain/Logbook';
import { PrismaClient } from '@prisma/client';

export class PrismaLogbookRepository implements ICrudRepository<Logbook> {
	constructor(
		private readonly _prismaClient: PrismaClient,
	) { }

	public async findById(id: string): Promise<Logbook | null> {
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

	public async findAll(where: never): Promise<Logbook[]> {
		throw new Error('Method not implemented.');
	}

	public async update(model: Logbook): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	public async deleteById(id: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	public async delete(model: Logbook): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

}