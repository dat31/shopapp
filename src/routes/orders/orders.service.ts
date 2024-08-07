import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItemService } from 'routes/orderitems/orderitems.service';
import { Order, Status } from './entities/order.entity';
import { Between, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';
import { User } from 'routes/users/entities/user.entity';
import { assign } from 'lodash';
import { FilterOrderDto } from './dto/filter-order.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private odRepo: Repository<Order>,
    private odItemService: OrderItemService,
    private configService: ConfigService,
  ) {}

  async create(
    creatorId: User['uid'],
    { items = [], creator, ...data }: CreateOrderDto,
  ) {
    const order = assign(new Order(), { items, ...data });
    order.orderDate = data.orderDate ? new Date(data.orderDate) : new Date();
    order.creator = { uid: creator.uid } as User;
    const createdOd = await this.odRepo.save(order);
    if (items.length) {
      await Promise.all(
        items.map((odItem) => this.odItemService.create(createdOd.id, odItem)),
      );
    }
    return createdOd;
  }

  async createItem(orderId: Order['id'], orderItem: CreateOrderItemDto) {
    return this.odItemService.create(orderId, orderItem);
  }

  async findAll(userUid: User['uid']) {
    const orders = await this.odRepo.find({
      where: [
        { creator: { uid: userUid } },
        { creator: { owner: { uid: userUid } } },
      ],
      relations: {
        creator: true,
        items: {
          product: { category: true },
        },
      },
    });
    return orders;
  }

  async filter(uid: User['uid'], conditions: FilterOrderDto) {
    const take = this.configService.get('PAGINATION_TAKE');
    const { from, to, status, creator, table, order, page = 0 } = conditions;
    const skip = page * take;
    const [data, total] = await this.odRepo.findAndCount({
      take,
      skip,
      withDeleted: true,
      where: {
        ...(from && to
          ? { orderDate: Between(new Date(from), new Date(to)) }
          : {}),
        creator: creator ? { uid: creator.uid } : [{ uid }, { owner: { uid } }],
        ...(status ? { status } : {}),
        ...(table ? { table: Like(`%${table.toLocaleLowerCase()}%`) } : {}),
      },
      relations: {
        creator: true,
        items: {
          product: { category: true },
        },
      },
      order: order as any,
    });
    const next = (page + 1) * take > total ? undefined : page + 1;
    const previous = page === 0 ? undefined : page - 1;
    return {
      data,
      total,
      next,
      previous,
    };
  }

  findOne(id: number) {
    return this.odRepo
      .createQueryBuilder('order')
      .withDeleted()
      .where({ id })
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
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
