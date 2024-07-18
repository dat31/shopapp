import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FirebaseAdminService } from 'firebase-admin/firebase-admin.service';
import { from, Observable, switchMap } from 'rxjs';
import { Order } from './entities/order.entity';
import { isArray } from 'lodash';

@Injectable()
export class GetCreatorInterceptor
  implements NestInterceptor<Order[] | Order, Order[] | Order>
{
  constructor(private firebaseAdminService: FirebaseAdminService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Order[] | Order> {
    return next
      .handle()
      .pipe(
        switchMap((data) =>
          isArray(data)
            ? from(
                Promise.all(
                  data.map(({ creator, ...data }) =>
                    this.firebaseAdminService.auth
                      .getUser(creator.uid)
                      .then((creator) => ({ creator, ...data })),
                  ),
                ),
              )
            : from(
                this.firebaseAdminService.auth
                  .getUser(data.creator)
                  .then((creator) => ({ ...data, creator })),
              ),
        ),
      );
  }
}
