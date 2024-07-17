import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import admin from 'firebase-admin';

export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    try {
      const user = await admin.auth().verifyIdToken(token, true);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (e) {
      console.log('auth error', e);
      throw new UnauthorizedException();
    }
  }
}
