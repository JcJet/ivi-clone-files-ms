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
      urls: [configService.get('RMQ_URL')],
      queue: 'toFilesMs',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices().then(() => {
    console.log('Files MS started.');
    console.log('Application variables:');
    for (const var_name of ['PORT', 'RMQ_URL', 'DB_HOST']) {
      console.log(`${var_name}: ${configService.get(var_name)}`);
    }
  });

  await app.listen(configService.get('PORT'));
}
bootstrap();
