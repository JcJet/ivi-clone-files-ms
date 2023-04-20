import { NestFactory } from '@nestjs/core';
import { FilesModule } from './files.module';
import { RmqService } from "@app/common";

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('FILES', true));
  await app.startAllMicroservices();
}
bootstrap();
