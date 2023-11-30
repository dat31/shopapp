import { Order } from 'routes/orders/entities/order.entity';
import { Product } from 'routes/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  //   @ManyToOne(() => Product, (product) => product.orderItems)
  //   product: Product;

  @ManyToOne(() => Product)
  product: Product;
}
