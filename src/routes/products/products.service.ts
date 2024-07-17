import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketService } from 'socket/socket.service';
import { Category } from 'routes/categories/entities/category.entity';
import { isEqual } from 'lodash';
import { FirebaseAdminService } from 'firebase-admin/firebase-admin.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(Category) private catRepo: Repository<Product>,

    private socketService: SocketService,
    private firebaseAdminService: FirebaseAdminService,
  ) {}

  async create({ category, ...body }: CreateProductDto) {
    const prod = {
      ...new Product(),
      ...body,
    } as unknown as Product;
    if (category?.id) {
      const prodCategory = await this.catRepo.findOne({
        where: { id: category?.id },
      });
      prod.category = prodCategory as any;
    }
    return this.prodRepo.save(prod);
  }

  async findAll() {
    const products = await this.prodRepo.find({
      relations: { category: true },
    });

    const categories = products.reduce((acc, product) => {
      if (acc.find((category) => isEqual(category, product.category))) {
        return acc;
      }
      return [...acc, product.category];
    }, []);

    return categories.map((category) => ({
      ...category,
      products: products.filter((product) =>
        isEqual(product.category, category),
      ),
    }));
  }

  findOne(id: number) {
    return this.prodRepo.findOne({
      withDeleted: true,
      where: { id },
      relations: { category: true },
    });

    // return this.prodRepo
    //   .createQueryBuilder()
    //   .withDeleted()
    //   .where({ id })
    //   .leftJoinAndSelect('category', 'category')
    //   .getOne();
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
