import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from 'routes/orderitems/dto/create-orderitem.dto';
import { Order } from '../entities/order.entity';

export class CreateOrderDto extends PartialType(Order) {
  orderItems: CreateOrderItemDto[];
}
