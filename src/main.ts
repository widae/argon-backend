import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(graphqlUploadExpress());

  await app.listen(3000);
}

bootstrap();
