import { Module } from '@nestjs/common';
import { EmployeeSchedulesService } from './employee-schedules.service';
import { EmployeeSchedulesController } from './employee-schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSchedule } from './entities/employee-schedule.entity';
import { User } from 'routes/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSchedule, User])],
  controllers: [EmployeeSchedulesController],
  providers: [EmployeeSchedulesService],
  exports: [EmployeeSchedulesService],
})
export class EmployeeSchedulesModule {}
