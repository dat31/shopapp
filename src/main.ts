import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as morgan from 'morgan';
import { sign, verify } from 'jsonwebtoken';

NestFactory.create(AppModule)
  .then((app) => {
    app.use(morgan('combined'));
    app.enableCors();
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );

    const token = sign({ hello: 'aaa' }, 'aaa');
    console.log(verify(token, 'aaa'));

    return app.listen(3000);
  })
  .then(() => {
    console.log('listening');
  });
