import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";

// for mail
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(5000, () => console.log('Host on http://localhost:5000'));
}
bootstrap();
