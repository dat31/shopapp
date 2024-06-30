import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as morgan from 'morgan';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

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
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(
          readFileSync(__dirname.concat('/service-account-key.json'), 'utf-8'),
        ),
      ),
    });

    return app.listen(3000);
  })
  .then(() => {
    console.log('listening');
  });
