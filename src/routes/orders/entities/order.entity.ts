import { OrderItem } from 'routes/orderitems/entities/orderitem.entity';
import { User } from 'routes/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  CREATED = 'CREATED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderDate: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
  })
  customer: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  items: OrderItem[];

  @ManyToOne(() => User)
  creator: User;

  @Column({ type: 'enum', enum: Status, default: Status.CREATED })
  status: Status;
}
