import { ILogbookRepository } from './ILogbookRepository';
import { Logbook } from '../domain/Logbook';

export class InMemoryLogbookRepository implements ILogbookRepository {

	private readonly _logbooks: Logbook[] = [];

	public async save(logbook: Logbook): Promise<boolean> {
		this._logbooks.push(logbook);

		return true;
	}

	public async find(id: string): Promise<Logbook | null> {
		return this._logbooks.find((logbook) => logbook.id === id) ?? null;
	}
}