import { SetMetadata } from '@nestjs/common';

export const AUTH = 'auth';
export const Auth = () => SetMetadata(AUTH, true);
