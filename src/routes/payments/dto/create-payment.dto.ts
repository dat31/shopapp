import { OmitType } from '@nestjs/mapped-types';
import { Payment } from '../entities/payment.entity';
import { Order } from 'routes/orders/entities/order.entity';

export class CreatePaymentDto extends OmitType(Payment, ['order']) {
  order: Pick<Order, 'id'>;
}
