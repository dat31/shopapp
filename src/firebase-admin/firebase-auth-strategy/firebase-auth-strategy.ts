import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DecodedIdToken } from 'firebase-admin/lib/auth';

export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
      algorithms: ['RS256'],
    });
  }

  async validate(user: DecodedIdToken) {
    console.log('validate', user.firebase);
    return {
      ...user,
      uid: user.sub,
    };
  }
}
