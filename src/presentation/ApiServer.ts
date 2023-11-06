import express, { Application, Router } from 'express';

export class ApiServer {
	constructor(
        public app: Application = express(),
        public port: number = 3000,
	) { }

	public async init(routes: Router[]) {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use('/api/v1', routes);
		return this;
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}`);
		});
	}
}