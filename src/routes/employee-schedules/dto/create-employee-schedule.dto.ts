import { OmitType } from '@nestjs/mapped-types';
import { EmployeeSchedule } from '../entities/employee-schedule.entity';
import { User } from 'routes/users/entities/user.entity';

export class CreateEmployeeScheduleDto extends OmitType(EmployeeSchedule, [
  'id',
  'employee',
]) {
  employee: Pick<User, 'id'>;
}
