import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from 'routes/orders/entities/order.entity';
import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { EmployeeSchedulesModule } from 'routes/employee-schedules/employee-schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, EmployeeSchedule]),
    EmployeeSchedulesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
