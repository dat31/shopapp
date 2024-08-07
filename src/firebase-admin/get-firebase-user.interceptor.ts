import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FirebaseAdminService } from 'firebase-admin/firebase-admin.service';
import { from, map, Observable, of, switchMap } from 'rxjs';
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

    return next.handle().pipe(
      switchMap((data) => {
        if (!data) {
          return of(data);
        }

        if (type === GetFirebaseUserInterceptor.OBJECT) {
          return from(
            this.firebaseAdminService
              .auth()
              .getUser(key ? data[key].uid : data.uid)
              .then((user) => (key ? { ...data, [key]: user } : user)),
          );
        }

        const extractedData = data?.data ? data.data : data;
        console.log(extractedData);
        return from(
          Promise.all(
            extractedData.map((e: T) =>
              this.firebaseAdminService
                .auth()
                .getUser(key ? e[key].uid : (e as any).uid)
                .then((user) => (key ? { ...e, [key]: user } : user)),
            ),
          ),
        ).pipe(
          map((res) => {
            if (data.data) {
              return {
                data: res,
                ...data,
              };
            }

            return res;
          }),
        );
      }),
    );
  }
}
