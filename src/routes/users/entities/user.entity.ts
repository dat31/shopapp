import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { Order } from 'routes/orders/entities/order.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @OneToMany(() => Order, (order) => order.customer, { nullable: true })
  orders: Order[];

  @OneToMany(() => EmployeeSchedule, (schedule) => schedule.employee, {
    nullable: true,
  })
  schedules: EmployeeSchedule[];

  @OneToMany(() => User, (u) => u.owner)
  employees: User;

  @ManyToOne(() => User, (u) => u.employees)
  owner: User;
}
