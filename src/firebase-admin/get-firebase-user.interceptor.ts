import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FirebaseAdminService } from 'firebase-admin/firebase-admin.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GetFirebaseUserInterceptor<T> implements NestInterceptor<T> {
  constructor(
    private firebaseAdminService: FirebaseAdminService,
    private reflector: Reflector,
  ) {}

  public static get ARRAY() {
    return 'array';
  }

  public static get OBJECT() {
    return 'object';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const [type, key] = this.reflector.getAllAndOverride<string[]>(
      'get-firebase-user',
      [context.getHandler(), context.getClass()],
    );

    console.log(type, key);

    return next.handle().pipe(
      switchMap((data) => {
        if (!data) {
          return of(data);
        }

        if (type === GetFirebaseUserInterceptor.OBJECT) {
          return from(
            this.firebaseAdminService
              .auth()
              .getUser(data[key].uid)
              .then((user) => ({ ...data, [key]: user })),
          );
        }

        return from(
          Promise.all(
            data.map((data: T) =>
              this.firebaseAdminService
                .auth()
                .getUser(data[key].uid)
                .then((user) => ({ ...data, [key]: user })),
            ),
          ),
        );
      }),
    );
  }
}
