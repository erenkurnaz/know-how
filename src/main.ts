import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IConfig } from '@config/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<IConfig, true>>(ConfigService);

  await app.listen(config.get('port'));
  console.log(`Server is listening on ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  Logger.error(
    `Failed to initialize, due to: ${error}`,
    error.constructor.name,
  );
  console.log(error);
});
