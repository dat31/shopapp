import { User } from 'routes/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeeSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.schedules)
  employee: User;

  @Column({ type: 'timestamp' })
  shiftStartTime: Date;

  @Column({ nullable: true, type: 'timestamp' })
  shiftEndTime: Date;
}
