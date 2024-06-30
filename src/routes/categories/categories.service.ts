import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from 'routes/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'routes/categories/dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from 'routes/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private catRepo: Repository<Category>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
  ) {}

  async create({ name }: CreateCategoryDto) {
    return this.catRepo.save({ ...new Category(), name });
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

  private findByIds(ids: Category['id'][]) {
    return this.catRepo.find({
      where: { id: In(ids) },
    });
  }

  // private async insertTree(children: Category[], parent: Category) {
  //   const savedParent = await this.catRepo.save(parent);
  //   await Promise.all(
  //     children
  //       .map((c) => ({ ...c, parent: savedParent }))
  //       .map((c) => (c.children ? this.insertTree(c.children, c) : c)),
  //   );
  //   return this.catTree.findDescendantsTree(savedParent);
  // }
}
