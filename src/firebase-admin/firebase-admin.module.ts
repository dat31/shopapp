import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth-strategy/firebase-auth-strategy';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './firebase-auth-guard/firebase-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [PassportModule, JwtModule],
  providers: [
    FirebaseAdminService,
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    admin.initializeApp({
      credential: admin.credential.cert({
        ...JSON.parse(
          readFileSync(
            __dirname.concat('/../service-account-key.json'),
            'utf-8',
          ),
        ),
      }),
    });
  }
}
