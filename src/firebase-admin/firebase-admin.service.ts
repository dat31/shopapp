import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  auth() {
    return admin.auth();
  }

  async uploadPhotoURL(file: Express.Multer.File) {
    console.log('UPLOAD PHOTO URL', file);
    const ref = admin.storage().bucket('user-images/');
    await ref.file(file.originalname).save(file.buffer);
    return ref
      .file(file.originalname)
      .getSignedUrl({ action: 'read', expires: 60 });
  }
}
