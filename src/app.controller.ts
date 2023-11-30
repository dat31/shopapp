import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'routes/users/entities/user.entity';
import { Order } from 'routes/orders/entities/order.entity';
import { Product } from 'routes/products/entities/product.entity';
import { OrderItem } from 'routes/orderitems/entities/orderitem.entity';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
  ) {}

  @Get('/hi')
  async getHi() {
    return 'hi';
  }

  @Get('hello')
  async getHello() {
    const order = new Order();
    order.orderDate = new Date();
    order.user = await this.userRepo.findOneBy({ id: 2 });
    const prods = await this.prodRepo.findBy({ id: In([5, 6]) });
    const createdOrder = await this.orderRepo.save(order);

    const orderItems = prods.map((prod) => {
      const item = new OrderItem();
      item.quantity = 1;
      item.product = prod;
      item.order = createdOrder;
      return item;
    });

    await this.orderItemRepo.save(orderItems);

    return this.appService.getHello();
  }
}
