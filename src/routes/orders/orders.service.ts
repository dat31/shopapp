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

  async create({ user, orderItems }: CreateOrderDto) {
    const od = new Order();
    od.orderDate = new Date();
    if (user?.id) {
      od.customer = await this.userService.findOne(user.id);
    }
    const createdOd = await this.odRepo.save(od);
    if (orderItems) {
      await Promise.all(
        orderItems.map((odItem) =>
          this.odItemService.create(createdOd, odItem),
        ),
      );
    }
    return createdOd;
  }

  findAll() {
    return this.odRepo.find({
      relations: {
        customer: true,
        creator: true,
        orderItems: {
          product: { categories: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.odRepo.find({
      where: { id },
      relations: {
        customer: true,
        creator: true,
        orderItems: {
          product: { categories: true },
        },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.odRepo.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.odRepo.delete(id);
  }
}
