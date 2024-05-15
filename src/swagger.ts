import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function useSwagger(app: NestExpressApplication, modules: any[]) {
  const config = new DocumentBuilder()
    .setTitle('PokerSD APIs')
    .setDescription('This document describes PokerSD RESTful APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    include: modules,
    extraModels: [],
  };

  const document = SwaggerModule.createDocument(app, config, options);
  const swaggerCustomOptions = {};
  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}
