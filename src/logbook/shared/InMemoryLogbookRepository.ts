import { ICreateRepository } from '../../interfaces/repository/ICreateRepository';
import { IReadRepository } from '../../interfaces/repository/IReadRepository';
import { Logbook } from '../domain/Logbook';

export class InMemoryLogbookRepository implements ICreateRepository<Logbook>, IReadRepository<Logbook> {

	private readonly _logbooks: Logbook[] = [];

	public async save(logbook: Logbook): Promise<boolean> {
		this._logbooks.push(logbook);

		return true;
	}

	public async findById(id: string): Promise<Logbook | null> {
		return this._logbooks.find((logbook) => logbook.id === id) ?? null;
	}

	static async findById(id: unknown): Promise<Logbook | null> {
		console.log('findById', id);
		return null;
	}

}