import { Order } from 'routes/orders/entities/order.entity';
import { Product } from 'routes/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @BeforeInsert()
  updatePrice() {
    this.price = this.product.price;
  }
  @Column({ type: 'decimal', nullable: true })
  price: number;
}
