import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { Order } from 'routes/orders/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DecodedIdToken } from 'firebase-admin/lib/auth';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

class FirebaseUser implements DecodedIdToken {
  aud: string;
  auth_time: number;
  email?: string;
  email_verified?: boolean;
  exp: number;
  firebase: {
    [key: string]: any;
    identities: { [key: string]: any };
    sign_in_provider: string;
    sign_in_second_factor?: string;
    second_factor_identifier?: string;
    tenant?: string;
  };
  sub: string;
  iat: number;
  iss: string;
  uid: string;
}

@Entity()
export class User extends FirebaseUser {
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

  @ManyToOne(() => User, (u) => u.employees)
  owner: User;
}
