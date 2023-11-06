import { PrismaClient } from '@prisma/client';
import { CreateLogbookUseCase } from './features/create-logbook/CreateLogbookUsaCase';
import { PrismaLogbookRepository } from './shared/PrismaLogbookRepository';
import { CreateLogbookController } from './features/create-logbook/CreateLogbookController';
import { GetLogbookController } from './features/get-logbook/GetLogbookController';
import { GetLogbookUseCase } from './features/get-logbook/GetLogbookUseCase';
import { Router } from 'express';

export async function LogbookMain(prismaClient: PrismaClient): Promise<Router> {
	//TODO: DEPS INJECTION
	const logbookRepository = new PrismaLogbookRepository(prismaClient);
	const createLogbookUseCase = new CreateLogbookUseCase(logbookRepository);
	const createLogbookController = new CreateLogbookController(createLogbookUseCase);
	const getLogbookUseCase = new GetLogbookUseCase(logbookRepository);
	const getLogbookController = new GetLogbookController(getLogbookUseCase);
    
	const router = Router();
	router.post('/logbook', (req, res) => createLogbookController.handle(req, res));
	router.get('/logbook', (req, res) => getLogbookController.handle(req, res));
	return router;
}