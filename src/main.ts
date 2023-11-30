import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as morgan from 'morgan';

NestFactory.create(AppModule)
  .then((app) => {
    app.use(morgan('tiny'));
    app.enableCors();
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
