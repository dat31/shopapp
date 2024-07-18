import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseAuthGuard
  extends AuthGuard('firebase-auth')
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAuth = this.reflector.getAllAndOverride<boolean>('firebase-auth', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('isAuth', isAuth);
    if (!isAuth) {
      return true;
    }
    return super.canActivate(context);
  }
}
