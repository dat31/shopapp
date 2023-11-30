import { OrderItem } from 'routes/orderitems/entities/orderitem.entity';
import { User } from 'routes/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderDate: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
  })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  orderItems: OrderItem[];
}
