import { NestFactory } from '@nestjs/core';
import { FilesModule } from './files.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBIT_MQ_URI')],
      queue: 'toFilesMs',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(configService.get('PORT'));
}
bootstrap();
