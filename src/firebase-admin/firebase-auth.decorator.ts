import { SetMetadata } from '@nestjs/common';

export const FirebaseAuth = (...args: string[]) =>
  SetMetadata('firebase-auth', args);

export const GetFirebaseUser = (...args: any) =>
  SetMetadata('get-firebase-user', args);
