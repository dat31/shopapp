import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from 'routes/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'routes/categories/dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'routes/products/entities/product.entity';
import { User } from 'routes/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private catRepo: Repository<Category>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
  ) {}

  async create({ name }: CreateCategoryDto, uid: User['uid']) {
    return this.catRepo.save({ ...new Category(), name, user: { uid } });
  }

  findAll() {
    return this.catRepo.find();
  }

  async findAllProducts() {
    return this.catRepo.find({ relations: { products: true } });
  }

  findProds(id: number) {
    return this.prodRepo.find({
      relations: {
        category: true,
      },
      where: { category: { id } },
    });
  }

  async findOne(id: number) {
    return this.catRepo.findOne({
      where: { id },
      relations: { products: true },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.catRepo.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.catRepo.delete(id);
  }
}
