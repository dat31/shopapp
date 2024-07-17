import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

@Global()
@Module({
  providers: [FirebaseAdminService],
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
