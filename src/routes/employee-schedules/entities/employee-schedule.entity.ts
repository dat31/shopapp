import { User } from 'routes/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeeSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.schedules)
  employee: User;

  @Column({ type: 'datetime' })
  shiftStartTime: Date;

  @Column({ nullable: true, type: 'datetime' })
  shiftEndTime: Date;
}
