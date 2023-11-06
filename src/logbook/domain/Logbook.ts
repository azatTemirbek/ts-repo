import { randomUUID } from 'crypto';

export class Logbook {
	constructor(
        public readonly name: string,
        public readonly userId: string,
        public readonly id: string = randomUUID()
	) { }
}
