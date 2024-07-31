import { PartialType } from '@nestjs/mapped-types';
import { Order } from '../entities/order.entity';
import { SortDirection } from 'typeorm';

export class FilterOrderDto extends PartialType(Order) {
  from: Date;
  to: Date;
  order: {
    orderDate: SortDirection;
  };
  page?: number;
}
