import { Product } from 'routes/products/entities/product.entity';

export class CreateOrderItemDto {
  product: Pick<Product, 'id'>;
  quantity: number;
}
