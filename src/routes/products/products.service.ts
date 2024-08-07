import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'routes/categories/entities/category.entity';
import { User } from 'routes/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(Category) private catRepo: Repository<Product>,
  ) {}

  async create(uid: User['uid'], { category, ...body }: CreateProductDto) {
    const prod = {
      ...new Product(),
      ...body,
    } as unknown as Product;
    console.log(prod, uid);
    if (category?.id) {
      const prodCategory = await this.catRepo.findOne({
        where: { id: category?.id },
      });
      prod.category = prodCategory as any;
    }
    prod.user = { uid } as User;
    return this.prodRepo.save(prod);
  }

  async findAll(uid: User['uid']) {
    console.log('get all uid', uid);
    return this.prodRepo.find({
      relations: { category: true },
      where: [
        {
          user: {
            owner: { uid },
          },
        },
        { user: { uid } },
      ],
    });
  }

  findOne(id: number) {
    return this.prodRepo.findOne({
      withDeleted: true,
      where: { id },
      relations: { category: true },
    });
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
