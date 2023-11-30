import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
  ) {}

  create({ categoryId, ...body }: CreateProductDto) {
    const prod = {
      ...new Product(),
      ...body,
      category: { id: categoryId },
    } as unknown as Product;
    return this.prodRepo.save(prod);
  }

  findAll() {
    return this.prodRepo.find({
      relations: { category: true },
    });
  }

  findOne(id: number) {
    return this.prodRepo
      .createQueryBuilder()
      .withDeleted()
      .where({ id })
      .getOne();
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prodRepo.save({ id, ...updateProductDto });
  }

  remove(id: number) {
    return this.prodRepo.softDelete(id);
  }

  findByIds(ids: Product['id'][]) {
    return this.prodRepo.findBy({ id: In(ids) });
  }
}
