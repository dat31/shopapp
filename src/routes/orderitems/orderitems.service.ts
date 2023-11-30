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

  async create(order: Order, { product, quantity }: CreateOrderItemDto) {
    const prod = await this.prodService.findOne(product.id);
    const odItem = { ...new OrderItem(), product: prod, order, quantity };
    return this.repo.save(odItem);
  }

  async findAll() {
    const items = await this.repo.find({ relations: { product: true } });
    return items.map((item) => ({
      ...item,
      total: this.getTotal(item),
    }));
  }

  async findOne(id: number) {
    const orderItem = await this.repo.findOne({
      where: { id },
      relations: { product: true },
    });

    return {
      ...orderItem,
      total: this.getTotal(orderItem),
    };
  }

  async update(id: number, { product, quantity }: UpdateOrderItemDto) {
    const item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException();
    }
    if (item.product.id === product.id && item.quantity === quantity) {
      return item;
    }
    if (item.product.id !== product.id) {
      const prod = await this.prodService.findOne(product.id);
      return this.repo.update(id, {
        product: prod,
        quantity,
      });
    }
    return this.repo.update(id, { quantity });
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
