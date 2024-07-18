import { SetMetadata } from '@nestjs/common';

export const FirebaseAuth = (...args: string[]) =>
  SetMetadata('firebase-auth', args);
