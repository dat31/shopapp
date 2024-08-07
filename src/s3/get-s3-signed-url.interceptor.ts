import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable, of, switchMap } from 'rxjs';
import { S3Service } from './s3.service';
import { Product } from 'routes/products/entities/product.entity';
import { isArray } from 'lodash';
import { User } from 'routes/users/entities/user.entity';

@Injectable()
export class GetS3SignedUrlInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly s3Service: S3Service) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { uid } = context.switchToHttp().getRequest().user;
    return next.handle().pipe(
      switchMap((data: Product[] | Product) => {
        if (!data) {
          return of(data);
        }
        if (isArray(data)) {
          const promises = data.map((product) =>
            this.getProductImageUrl(uid, product),
          );
          return from(Promise.all(promises));
        }
        return this.getProductImageUrl(uid, data);
      }),
    );
  }

  private async getProductImageUrl(uid: User['uid'], product: Product) {
    console.log(product.imageUrl);
    if (!product.imageUrl) {
      return product;
    }
    const url = await this.s3Service.getSignedUrl(uid, product.imageUrl);
    return { ...product, imageUrl: url };
  }
}
