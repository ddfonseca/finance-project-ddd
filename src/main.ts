import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from '@config/env';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap () {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.setViewEngine('ejs');
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.use(helmet());
	await app.listen(process.env.PORT ?? PORT);
}
bootstrap();
