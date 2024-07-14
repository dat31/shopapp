import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItemService } from 'routes/orderitems/orderitems.service';
import { Order, Status } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'routes/users/users.service';
import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';
import { User } from 'routes/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private odRepo: Repository<Order>,
    private odItemService: OrderItemService,
    private userService: UsersService,
  ) {}

  async create(creatorId: User['id'], { orderItems }: CreateOrderDto) {
    const od = new Order();
    od.orderDate = new Date();
    // if (user?.id) {
    //   od.customer = await this.userService.findOne(user.id);
    // }
    const creator = await this.userService.findOne(creatorId);

    console.log('creator', creator);
    od.creator = creator;

    const createdOd = await this.odRepo.save(od);
    if (orderItems) {
      await Promise.all(
        orderItems.map((odItem) =>
          this.odItemService.create(createdOd.id, odItem),
        ),
      );
    }
    return createdOd;
  }

  async createItem(orderId: Order['id'], orderItem: CreateOrderItemDto) {
    return this.odItemService.create(orderId, orderItem);
  }

  findAll() {
    return this.odRepo.find({
      relations: {
        customer: true,
        creator: true,
        items: {
          product: { category: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.odRepo
      .createQueryBuilder('order')
      .withDeleted()
      .where({ id })
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.creator', 'creator')
      .getOne();
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.odRepo.save({ id, ...updateOrderDto });
  }

  cancel(id: number) {
    return this.odRepo.save({ id, status: Status.CANCELED });
  }

  complete(id: number) {
    return this.odRepo.save({ id, status: Status.COMPLETED });
  }

  remove(id: number) {
    return this.odRepo.delete(id);
  }
}
