import { PrismaClient } from '@prisma/client';
import { ApiServer } from './presentation/ApiServer';
import { LogbookMain } from './logbook';

export async function main(): Promise<void> {
	const prismaClient = new PrismaClient();
	const routes = [
		await LogbookMain(prismaClient)
	];
	const apiServer = await new ApiServer().init(routes);
	apiServer.listen();
}

main();