import { OmitType } from '@nestjs/mapped-types';
import { Category } from 'routes/categories/entities/category.entity';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends OmitType(Product, ['id', 'category']) {
  categoryId: Category['id'][];
}
