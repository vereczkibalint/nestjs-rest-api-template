import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService  } from '@nestjs/config/dist';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Since in bootstrap we cannot use DI in constructor
  // we get the instancef of ConfigService from context with app.get()
  const configService = app.get(ConfigService);
  const port = configService.get<string>('APP_PORT');

  // NestJS Swagger default setup
  const config = new DocumentBuilder()
    .setTitle('API title')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port || 3000);
}
bootstrap();
