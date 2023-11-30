import { Product } from 'routes/products/entities/product.entity';

export class CreateOrderItemDto {
  prodId: Product['id'];
  quantity: number;
}
