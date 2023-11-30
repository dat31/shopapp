import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItemService } from 'routes/orderitems/orderitems.service';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'routes/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private odRepo: Repository<Order>,
    private odItemService: OrderItemService,
    private userService: UsersService,
  ) {}

  async create({ userId, odItems }: CreateOrderDto) {
    const od = new Order();
    od.orderDate = new Date();
    if (userId) {
      od.user = await this.userService.findOne(userId);
    }
    const createdOd = await this.odRepo.save(od);
    if (odItems) {
      await Promise.all(
        odItems.map((odItem) => this.odItemService.create(createdOd, odItem)),
      );
    }
    return createdOd;
  }

  findAll() {
    return this.odRepo.find({
      relations: {
        user: true,
        orderItems: {
          product: { categories: true },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
