import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'routes/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
  ) {}

  create({ categoryIds, ...body }: CreateProductDto) {
    const prod = { ...new Product(), ...body };
    prod.categories = categoryIds.map((id) => ({ id }) as Category);
    return this.prodRepo.save(prod);
  }

  findAll() {
    return this.prodRepo.find({ relations: { categories: true } });
  }

  findOne(id: number) {
    return this.prodRepo.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prodRepo.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.prodRepo.delete(id);
  }

  findByIds(ids: Product['id'][]) {
    return this.prodRepo.findBy({ id: In(ids) });
  }
}
