import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const port = process.env.PORT;

  let key = fs.readFileSync('./ssl/private.key');
  let cert = fs.readFileSync('./ssl/certificate.crt');
  let ca = fs.readFileSync('./ssl/ca_bundle.crt');
  const httpsOptions = {
    key: key,
    cert: cert,
    ca: ca,
  };

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    httpsOptions,
    cors: true
  });

  //logger: ['error', 'warn', 'log']
  app.setGlobalPrefix('api');
  //app.enableCors();
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Cipo-CRM backend')
    .setDescription('restAPI form backend ')
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(port);
}
bootstrap();
