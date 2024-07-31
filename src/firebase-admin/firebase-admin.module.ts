import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [PassportModule, JwtModule],
  providers: [
    FirebaseAdminService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule implements OnApplicationBootstrap {
  constructor(private configService: ConfigService) {}

  onApplicationBootstrap() {
    admin.initializeApp({
      storageBucket: this.configService.get('FIREBASE_STORAGE'),
      credential: admin.credential.cert(
        JSON.parse(
          readFileSync(
            __dirname.concat('/../service-account-key.json'),
            'utf-8',
          ),
        ),
      ),
    });
  }
}
