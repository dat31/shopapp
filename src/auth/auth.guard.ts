import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AUTH } from './decorators/auth.decorator';
import { ADMIN } from './decorators/admin.decorator';
import { Role } from 'routes/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private confService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuth = this.getReflectValue(context, AUTH);
    if (!isAuth) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { user } = this.jwtService.verify(token, {
        secret: this.confService.get('JWT_SECRET'),
      });
      const isAdmin = this.getReflectValue(context, ADMIN);
      const { role } = user;
      if (isAdmin && role !== Role.ADMIN) {
        throw new UnauthorizedException();
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = user;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private getReflectValue(ctx: ExecutionContext, key: string) {
    return this.reflector.getAllAndOverride<boolean>(key, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  }
}
