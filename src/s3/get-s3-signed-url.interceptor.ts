import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { S3Service } from './s3.service';
import { Product } from 'routes/products/entities/product.entity';
import { isEqual } from 'lodash';

@Injectable()
export class GetS3SignedUrlInterceptor implements NestInterceptor {
  constructor(private readonly s3Service: S3Service) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { uid } = context.switchToHttp().getRequest().user;
    return next.handle().pipe(
      switchMap((data: Product[]) => {
        if (!data) {
          return of(data);
        }
        const promises = data.map(({ imageUrl, ...product }) => {
          if (!imageUrl) {
            return product;
          }
          return this.s3Service
            .getSignedUrl(uid, imageUrl)
            .then((url) => ({ ...product, imageUrl: url }));
        });
        return from(Promise.all(promises));
      }),
      map((data) => {
        const categories = data.reduce((acc, product) => {
          if (
            acc.findIndex((category) => isEqual(category, product.category)) !==
            -1
          ) {
            return acc;
          }
          return [...acc, product.category];
        }, []);

        return categories.map((category) => ({
          ...category,
          products: data.filter((product) =>
            isEqual(product.category, category),
          ),
        }));
      }),
    );
  }
}
