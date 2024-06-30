import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'routes/products/products.module';
import { CategoriesModule } from 'routes/categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'auth/auth.module';
import { UsersModule } from 'routes/users/users.module';
import { OrdersModule } from 'routes/orders/orders.module';
import { OrderitemsModule } from 'routes/orderitems/orderitems.module';
import { EmployeeSchedule } from 'routes/employee-schedules/entities/employee-schedule.entity';
import { PaymentsModule } from 'routes/payments/payments.module';
import { EmployeeSchedulesModule } from 'routes/employee-schedules/employee-schedules.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    OrderitemsModule,
    EmployeeSchedule,
    PaymentsModule,
    EmployeeSchedulesModule,
    SocketModule,
  ],
})
export class AppModule {}
