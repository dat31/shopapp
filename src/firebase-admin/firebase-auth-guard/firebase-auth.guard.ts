import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAdminService } from 'firebase-admin/firebase-admin.service';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly firebaseService: FirebaseAdminService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isAuth = this.reflector.getAllAndOverride<boolean>('firebase-auth', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAuth) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
