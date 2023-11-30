import { Order } from 'routes/orders/entities/order.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order)
  order: Order;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  method: PaymentMethod;
}
