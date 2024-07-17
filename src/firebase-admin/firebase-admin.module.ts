import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth-strategy/firebase-auth-strategy';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase-jwt' })],
  providers: [FirebaseAdminService, FirebaseAuthStrategy],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    admin.initializeApp({
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
