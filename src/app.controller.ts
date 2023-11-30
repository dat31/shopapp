import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.appService.getHello();
  }
}
