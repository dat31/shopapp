import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

NestFactory.create(AppModule)
  .then((app) => {
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );
    return app.listen(3000);
  })
  .then(() => {
    console.log('listening');
  });
