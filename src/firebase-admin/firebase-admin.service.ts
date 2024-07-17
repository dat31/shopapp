import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  async getUser() {
    this.auth.getUserByPhoneNumber('+84868104024').then((res) => {
      console.log('res', res);
    });
  }

  get auth() {
    return admin.auth();
  }
}
