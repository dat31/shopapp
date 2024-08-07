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

  @Column({ type: 'timestamp' })
  orderDate: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  items: OrderItem[];

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  creator: User;

  @Column({ type: 'enum', enum: Status, default: Status.CREATED })
  status: Status;

  @Column({ nullable: true, default: '#' })
  table: string;
}
