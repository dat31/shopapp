import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketService } from 'socket/socket.service';
import { Category } from 'routes/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(Category) private catRepo: Repository<Product>,

    private socketService: SocketService,
  ) {}

  async create({ category: { id }, ...body }: CreateProductDto) {
    const category = await this.catRepo.findOne({ where: { id } });
    const prod = {
      ...new Product(),
      ...body,
    } as unknown as Product;
    prod.category = category as any;
    return this.prodRepo.save(prod);
  }

  async findAll() {
    const prods = await this.prodRepo.find({
      relations: { category: true },
    });
    this.socketService.emit(prods);
    return prods;
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
