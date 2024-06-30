import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-orderitem.dto';
import { UpdateOrderItemDto } from './dto/update-orderitem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'routes/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { ProductsService } from 'routes/products/products.service';

@Injectable()
export class OrderItemService {
  constructor(
    private prodService: ProductsService,
    @InjectRepository(OrderItem) private repo: Repository<OrderItem>,
  ) {}

  async create(
    orderId: Order['id'],
    { product, quantity }: CreateOrderItemDto,
  ) {
    const prod = await this.prodService.findOne(product.id);
    const odItem = {
      ...new OrderItem(),
      product: prod,
      order: { id: orderId },
      quantity,
      price: prod.price,
    };
    const resp = await this.repo.save(odItem);
    console.log('resp', resp);
    return resp;
  }

  async findAll() {
    return this.repo.find({ relations: { product: true } });
  }

  async findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { product: true },
    });
  }

  async update(id: number, { quantity }: UpdateOrderItemDto) {
    const item = await this.repo
      .createQueryBuilder('orderItem')
      .withDeleted()
      .where({ id })
      .leftJoinAndSelect('orderItem.product', 'product')
      .getOne();

    if (!item) {
      throw new NotFoundException();
    }

    if (item.quantity === 0) {
      return this.repo.delete(id);
    }
    const resp = await this.repo.save({
      id,
      quantity,
      price: item.product.price,
    });
    console.log('qty', { ...resp, product: item.product });
    return { ...resp, product: item.product };
  }

  remove(id: number | number[]) {
    return this.repo.delete(id);
  }

  private getTotal(orderItem: OrderItem) {
    if (!orderItem.product) {
      return 0;
    }
    return Number(orderItem.product.price) * orderItem.quantity;
  }
}
