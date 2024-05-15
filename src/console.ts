import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    // cliName: 'athliv',
    // debug: true
  });
  process.exit(0);
}

bootstrap();
