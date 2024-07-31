import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { Order } from 'routes/orders/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from 'routes/products/entities/product.entity';
import { Category } from 'routes/categories/entities/category.entity';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity()
export class User {
  @PrimaryColumn()
  uid: string; //firebase uid

  @Column({ nullable: true })
  cloudMessageToken: string;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @OneToMany(() => Order, (order) => order.creator, { nullable: true })
  orders: Order[];

  @OneToMany(() => EmployeeSchedule, (schedule) => schedule.employee, {
    nullable: true,
  })
  schedules: EmployeeSchedule[];

  @OneToMany(() => User, (u) => u.owner)
  employees: User[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @ManyToOne(() => User, (u) => u.employees)
  owner: User;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
}
