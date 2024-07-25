import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DecodedIdToken } from 'firebase-admin/lib/auth';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
      algorithms: ['RS256'],
    });
  }

  async validate(user: DecodedIdToken) {
    return {
      ...user,
      uid: user.sub,
    };
  }
}
