import { Injectable } from '@nestjs/common';
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

  async create(order: Order, { prodId, quantity }: CreateOrderItemDto) {
    const product = await this.prodService.findOne(prodId);
    const odItem = { ...new OrderItem(), product, order, quantity };
    return this.repo.save(odItem);
  }

  findAll() {
    return `This action returns all orderitems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderitem`;
  }

  update(id: number, updateOrderitemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderitem`;
  }
}
