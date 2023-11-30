import { OmitType } from '@nestjs/mapped-types';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto extends OmitType(Category, ['id']) {
  name: string;
}
